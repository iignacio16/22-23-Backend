import { RouterContext } from "oak/router.ts";
import { AccesToUsersCollection } from "../db/mongo.ts";
import { userSchema } from "../db/schemas.ts";

type deleteUserContext = RouterContext<
"/deleteUser",
Record<string | number, string | undefined>,
Record<string, any>
>;

export const deleteUser = async (context : deleteUserContext) => {
    try{
        const body = context.request.body({ type: "json" });
        const value = await body.value;

        if(!value.name || !value.email){
            context.response.status = 406;
            context.response.body = {
                message : "Indica Parametros"
            }
            return;
        }

        const user: userSchema | undefined = await AccesToUsersCollection
        .findOne({
            name: value.name,
            email : value.email
        })

        if (!user) {
            context.response.status = 404;
            context.response.body = {
                message: "El usuario que intenta eliminar no se encuentra en la base de datos"
            }
            return;
        }

        await AccesToUsersCollection.deleteOne({_id: user._id})
        context.response.status = 200
        context.response.body = {
            message : "Usuario eliminado correctamente"
        }
    }catch(e){
        console.error(e);
        context.response.status = 500;
    }
}