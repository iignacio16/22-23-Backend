import { RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { AccesToUserCollection } from "../db/mongo.ts";
import { userSchema } from "../db/schemas.ts";

type GetUserContext = RouterContext<
  "/getUser/:parametro",
  {
    parametro: string
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getUser = async (context: GetUserContext) => {
  try {
    const parametro = context.params?.parametro;

    if (parametro) {
      const usuario: userSchema | undefined = await AccesToUserCollection
        .findOne({
          $or: [
            { DNI: parametro },
            { Telefono: parametro },
            { email: parametro },
            { IBAN: parametro },
          ]
        });

      if (usuario) {
        context.response.status = 200;
        context.response.body = usuario;
        return;
      }
      context.response.status = 404;
      context.response.body = {
        message : "No existe el usuario"
      }
    }
    context.response.status = 400;
    context.response.body = {
        message: "Indica parametro maquina"
    }
  } catch (e) {
    context.response.status = 500;
    console.error(e);
  }
};
