import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { AccesToUserCollection } from "../db/mongo.ts";

type DeleteUserContext = RouterContext<
  "/deleteUser/:email",
  {
    email: string
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteUser = async (context: DeleteUserContext) =>{
    try{
        if(context.params?.email){
            const user = await AccesToUserCollection.findOne({email : context.params.email})
            if(user){
                await AccesToUserCollection.deleteOne({email: context.params.email})
                context.response.status= 200
                context.response.body = {
                    message : "User deleted"
                }
            }else{
                context.response.status = 404
                context.response.body = {
                    message : "Not user found"
                }
            }
        }
    }catch (e) {
        context.response.status = 500;
        console.error(e);
      }
}