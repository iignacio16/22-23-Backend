import {MongoClient} from "mongo"
import {config} from "https://deno.land/x/dotenv@v3.2.0/mod.ts"
import { authorSchema, bookSchema, userSchema } from "./schemas.ts";

const env = config();

if(!env.MONGO_USER || !env.MONGO_PSW ){
    console.log("Not MONGO_USR and MONGO_PSW env variables define");
    throw Error("Not MONGO_USR and MONGO_PSW env variables define");
}

const mongo_url = `mongodb+srv://${ env.MONGO_USER }:${ env.MONGO_PSW  }@cluster-nebrija.ojfmk.mongodb.net/Practica3?authMechanism=SCRAM-SHA-1`

const client = new MongoClient();
await client.connect(mongo_url);
const db = client.database("Practica3");
console.log("MongoDB connected");

export const AccesToUsersCollection = db.collection<userSchema>("Users");
export const AccesToBooksCollection = db.collection<bookSchema>("Books");
export const AccesToAuthorCollection = db.collection<authorSchema>("Authors");