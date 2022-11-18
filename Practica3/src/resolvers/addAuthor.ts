import { RouterContext } from "oak/router.ts";
import { AccesToAuthorCollection, AccesToBooksCollection } from "../db/mongo.ts";
import { authorSchema, bookSchema } from "../db/schemas.ts";
import { books } from "../types.ts";

type addAuthorContext = RouterContext<
"/addAuthor", Record<string | number, string | undefined>, 
Record<string, any>>

export const addAuthor = async (context : addAuthorContext) => {
    try{
        const body = context.request.body({ type: "json" });
        const value = await body.value;

        if(!value.name){
            context.response.status = 406;
            context.response.body = {
                message : "Indica Parametros"
            }
            return
        }

        const author : authorSchema | undefined = await AccesToAuthorCollection
        .findOne({
            name : value.name
        })

        const newAuthor: Partial<authorSchema> = {...value}
       
        if(author){ 
            context.response.status = 404
            context.response.body = {
                message: "Autor ya en la base de datos"
            }
        }else{
            await AccesToAuthorCollection.insertOne(newAuthor as authorSchema)
            const { _id, ...authorWithoutId } = newAuthor as authorSchema;
            context.response.body = authorWithoutId
            context.response.status = 200;
        }
    }catch(e){
        console.error(e);
        context.response.status = 500;
    }
}