import {ObjectId} from "mongo";
import * as bcrypt from "bcrypt";
import { userSchema } from "../db/schemaMongo.ts";
import { UsersCollection } from "../db/dbConnect.ts";

export const Query = {
    createUser: async (
        _: unknown,
        args: {
            username: string;
            password: string;
        },
        ctx:any
    ): Promise<userSchema> => {
        try{

            const secretKey = Deno.env.get("JWT_SECRET")
            if(!secretKey){ throw new Error("Falta clave secreta")}

            const user: userSchema | undefined = await UsersCollection.findOne({
                username: args.username,
            });
            if(user){
                throw new Error("user already exists");
            }
            const hashedPassword = await bcrypt.hash(args.password);
            const _id = new ObjectId();
            if(!ctx.lang) throw new Error("Language not specified");
            // const token = await createJWT(
            //     {
            //         id: _id.toString(),
            //         username: args.username,
            //         password: hashedPassword,
            //         created_at: new Date().toISOString(),
            //         language: ctx.lang
            //     },
            //     secretKey
            // )
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
    }
}