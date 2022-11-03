import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { AccesToTransactionsCollection, AccesToUserCollection } from "../db/mongo.ts";
import { transactionSchema, userSchema } from "../db/schemas.ts";

type PostTransactionContext = RouterContext<
  "/postTransaction",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postTransaction = async (context: PostTransactionContext) => {
  try {
    const transaction = context.request.body({ type: "json" });
    const value = await transaction.value;

    if (!value.ID_reciber || !value.ID_sender || !value.amount) {
      context.response.status = 400;
      context.response.body = {
        message: "missing params",
      };
      return;
    }

    const userSender: userSchema | undefined = await AccesToUserCollection.findOne({
        _id: new ObjectId(value.ID_sender),
      });
    const userReciber: userSchema | undefined = await AccesToUserCollection.findOne({
        _id: new ObjectId(value.ID_reciber),
      });

    if(!userSender || !userReciber){
        context.response.status = 404
        context.response.body = {
            message: "Id_sender or Id_reciber dont exist in database",
          };
    }else{
        const newTransaction: transactionSchema = {
            ...value} 
        await AccesToTransactionsCollection.insertOne(newTransaction)
        context.response.status = 200
        context.response.body = {newTransaction}
    }
  } catch (e) {
    context.response.status = 500;
    console.error(e);
  }
};
