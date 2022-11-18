import { RouterContext } from "oak/router.ts";
import { AccesToAuthorCollection, AccesToBooksCollection, AccesToUsersCollection } from "../db/mongo.ts";
import { authorSchema, bookSchema } from "../db/schemas.ts";
import { author, books } from "../types.ts";
import {v4} from "uuid";
import { addAuthor } from "./addAuthor.ts";

type addBookContext = RouterContext<
"/addBook", Record<string | number, string | undefined>, 
Record<string, any>>

export const addBook = async (context: addBookContext) => {
    try{
        const body = context.request.body({ type: "json" });
        const value = await body.value;

        if(!value.title || !value.author || !value.pages){
            context.response.status = 406;
            context.response.body = {
                message : "Indica Parametros"
            }
            return;
        }
        
        const book: bookSchema | undefined = await AccesToBooksCollection
        .findOne({
            title: value.title,
            author: value.author,
            pages: value.pages
        })

        const autor = await AccesToAuthorCollection
        .find({name: value.author})

        const newISBN = crypto.randomUUID();

        
        const newBook : books = {
            title : value.title,
            author : value.author,
            pages : value.pages,
            ISBN: newISBN
        }
        
        if(book){ 
            context.response.status = 404
            context.response.body = {
                message: "Libro ya en la base de datos"
            }
        }else{
            await AccesToBooksCollection.insertOne(newBook as bookSchema)
            const { _id, ...bookWithoutId } = newBook as bookSchema;
            context.response.body = bookWithoutId
            context.response.status = 200;
        }
        if(!autor){
            const newAuthor: author = {
                name : value.author,
                idBooks: [book!._id.toString()]
            }
            await AccesToAuthorCollection.insertOne(newAuthor as authorSchema)
        }else{
            await AccesToAuthorCollection.updateOne(
                {name: value.author},
                { $push:{
                    idBooks:{
                        $each: [book!._id.toString()]
                    }  
                }}
            )
         
        }
    }catch(e){
        console.error(e);
        context.response.status = 500;
    }
}