import { ObjectId } from "mongo";
import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { AccesToUsersCollection } from "../db/mongo.ts";
import { userSchema } from "../db/schemas.ts";

type getUserContext = RouterContext<
"/getUser/:id",{
    id: string
} &  Record<string | number, string | undefined>, 
Record<string, any>>;

export const getUser = async (context : getUserContext) => {
     try{
        const param = getQuery(context, {mergeParams: true});
        if(context.params?.id){
            const user: userSchema | undefined = await AccesToUsersCollection
            .findOne({
                _id: new ObjectId(context.params.id)
            })
            if(user) {
                context.response.body = user;
                context.response.status = 200;
                return;
            }
        }
     }catch(e){
        console.error(e);
        context.response.status = 500;
    }
}