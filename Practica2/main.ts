import {Application,Router} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { deleteUser } from "./resolvers/deleteUser.ts";
import { getUser } from "./resolvers/getUser.ts";
import { postTransaction } from "./resolvers/postTransaction.ts";
import { postUser } from "./resolvers/postUser.ts";

try{const router = new Router();

router
  .get("/test", (context)=>{
    context.response.body= "funcionando";
  })
  .post("/user", postUser)
  .get("/getUser/:parametro", getUser)
  .delete("/deleteUser/:email", deleteUser)
  .post("/postTransaction",postTransaction)
  
const app = new Application()

app.use(router.routes());
app.use(router.allowedMethods());

console.info("Server waiting for request on port 7777")
await app.listen({port: 7777})
}catch(e){
  throw e;
}