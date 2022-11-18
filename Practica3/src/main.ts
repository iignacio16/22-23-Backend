//deno run --allow-all --watch --import-map ./import_map.json src/main.ts
import { Application, Router } from "oak";
import { AccesToUsersCollection } from "./db/mongo.ts";
import { addAuthor } from "./resolvers/addAuthor.ts";
import { addBook } from "./resolvers/addBook.ts";
import { addUser } from "./resolvers/addUser.ts";
import { deleteUser } from "./resolvers/deleteUser.ts";
import { getUser } from "./resolvers/getUser.ts";
import { updateCart } from "./resolvers/updateCart.ts";

const router = new Router();
//paginacion con limit y escaep

router
  .get("/test", (context) => {
    context.response.body = "Empezando";
    AccesToUsersCollection.find();
  })
  .post("/addUser", addUser)
  .post("/addBook", addBook)
  .post("/addAuthor", addAuthor)
  .delete("/deleteUser", deleteUser)
  .put("/updateCart", updateCart)
  .get("/getUser/:id", getUser)

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7500 });
