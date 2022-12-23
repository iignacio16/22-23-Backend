import {ObjectId} from "mongo";
import * as bcrypt from "bcrypt";
import { userSchema } from "../db/schemaMongo.ts";
import { UsersCollection } from "../db/dbConnect.ts";
import { createJWT } from "../utils/jwt.ts";

export const Mutation = {
    createUser: async (
        _: unknown,
        args: {
            username: string;
            password: string;
        },
        ctx:any
    ): Promise<userSchema> => {
        try{

            const user: userSchema | undefined = await UsersCollection.findOne({
                username: args.username,
            });
            if(user){
                throw new Error("user already exists");
            }
            const hashedPassword = await bcrypt.hash(args.password);
            const _id = new ObjectId();
            if(!ctx.lang) throw new Error("Language not specified");

            const newUser : userSchema = {
                    _id,
                    username: args.username,
                    password: hashedPassword,
                    created_at: new Date().toISOString(),
                    language: ctx.lang
            }

            await UsersCollection.insertOne(newUser);
            
            return newUser;


        } catch (e) {
            throw new Error(e);
        }
    },
    login: async (
        _: unknown,
        args: {
            username: string;
            password: string
        },
        ctx:any
    ): Promise<string> => {
        try{
            const secretKey = Deno.env.get("JWT_SECRET")
            if(!secretKey){ throw new Error("Falta clave secreta")}

            const user : userSchema | undefined = await UsersCollection.findOne({
                username: args.username
            });
            if(!user) throw new Error("User doesnt exist");

            const validPassword = await bcrypt.compare(args.password, user.password);
            if(!validPassword) throw new Error("contraseña incorrecta");

             const token = await createJWT(
                {
                    id: user._id.toString(),
                    username: user.username,
                    password: user.password,
                    created_at: user.created_at,
                    language: user.language
                },
                secretKey
                )
            await UsersCollection.updateOne(
                {_id: user._id},
                {
                    $set:{
                        token: token
                    } 
                }
            )
            return token;
        }catch(e){
            throw new Error(e);
        }
    },

    deleteUser: async (
        _:unknown,
        ctx:any
    ): Promise<userSchema> => {
        try{


            if(!ctx.token) {
                throw new Error("Falta token");
            }

            const user: userSchema | undefined = await UsersCollection.findOne({
                token: ctx.token
            })
            if(!user) throw new Error("Usuario no registrado");

             await UsersCollection.updateOne(
                {username: user.username},
                {
                    $set:{
                        token: undefined
                    } 
                }
            )
            return user
        }catch(e){
            throw new Error(e)
        }
    }
}