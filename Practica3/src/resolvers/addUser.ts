import { RouterContext } from "oak/router.ts";
import * as bcrypt from "bcrypt"
import { AccesToUsersCollection } from "../db/mongo.ts";
import { userSchema } from "../db/schemas.ts";


 function validarCorreo(email: string){
    const expReg= /^[a-z0-9!#$%&'+/=?^`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/; 
    return expReg.test(email);
}

type addUserContext = RouterContext<
"/addUser", Record<string | number, string | undefined>, 
Record<string, any>>

export const addUser = async (context: addUserContext) => {
    try{
        const body = context.request.body({ type: "json" });
        const value = await body.value;

        if(!value.name || !value.password || !value.email){
            context.response.status = 406;
            context.response.body = {
                message : "Indica Parametros"
            }
            return;
        }

        const correoValido = validarCorreo(value.email);

        const user: userSchema | undefined = await AccesToUsersCollection
        .findOne({
            email : value.email
        })

        const passwordHash = await bcrypt.hash(value.password)

        const newUser : Partial<userSchema> = {
            name : value.name,
            password : passwordHash,
            email : value.email,
            createdAt : new Date().toISOString()
        }

        if(correoValido){
            if(user){ 
                context.response.status = 404
                context.response.body = {
                    message: "Usuario ya existente en la base de datos"
                }
            }else{
                await AccesToUsersCollection.insertOne(newUser as userSchema)
                const { _id, ...userWithoutId } = newUser as userSchema;
                context.response.body = userWithoutId
                context.response.status = 200;
            }
        }else {
            context.response.status = 404;
            context.response.body = {
                message : "Email not valid"
            }
        }
    }catch(e){
        console.error(e);
        context.response.status = 500;
    }
}