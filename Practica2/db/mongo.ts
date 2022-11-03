import { MongoClient} from "https://deno.land/x/mongo@v0.31.1/mod.ts"
import { transactionSchema, userSchema } from "./schemas.ts";


    const mongo_usr = "Ignacio"
    const mongo_pwd = "Ignacio"
    const db_name = "Practica2"
    const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@cluster-nebrija.ojfmk.mongodb.net/${db_name}?authMechanism=SCRAM-SHA-1`

    const client = new MongoClient();
    await client.connect(mongo_url);
    const db = client.database(db_name);
    console.log("MongoDB connected");


export const AccesToUserCollection = db.collection<userSchema>("Users")
export const AccesToTransactionsCollection = db.collection<transactionSchema>("Transactions")
