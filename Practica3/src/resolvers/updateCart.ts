import { RouterContext } from "oak/router.ts";
import { AccesToBooksCollection, AccesToUsersCollection } from "../db/mongo.ts";
import { bookSchema, userSchema } from "../db/schemas.ts";

type updateCartContext = RouterContext<
"/updateCart",
Record<string | number, string | undefined>,
Record<string, any>
>;

export const updateCart = async (context: updateCartContext) =>{
    try{
        const body = context.request.body({ type: "json" });
        const value = await body.value;

        if(!value.name || !value.email || !value.title || !value.author){
            context.response.status = 406;
            context.response.body = {
                message : "Indica nombre email titulo y autor"
            }
            return;
        }

        const user: userSchema | undefined = await AccesToUsersCollection
        .findOne({
            name: value.name,
            email : value.email
        })
        
        const book : bookSchema | undefined = await AccesToBooksCollection
        .findOne({
            $or: [
                {title : value.title},
                {author : value.author}
              ]
        })

        if(!user || !book){
            context.response.status = 404;
            context.response.body = {
                message : "No existe el usuario o el libro introducido"
            }
            return;
        }else{
            await AccesToUsersCollection.updateOne(
                {_id : user._id},
                { $push:{
                    Cart:{
                        $each: [book._id.toString()]
                    }  
                }}
            )

        }

    }catch(e){
        console.error(e)
        context.response.status = 500;
    }
}