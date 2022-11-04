import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { BODY_TYPES } from "https://deno.land/x/oak@v11.1.0/util.ts";
import { AccesToUserCollection } from "../db/mongo.ts";
import { userSchema } from "../db/schemas.ts";

type postUser = RouterContext <"/user", Record<string | number, string | undefined>,
 Record<string, any>>

 const randomIBAN = (Math.floor(100000000000000000000 + Math.random() * 900000000000000000000))
 

 function validarDNI(DNI: string) {
    const expReg = /^([0-9]{8})([A-Z]{1})$/;
    const valido = expReg.test(DNI)
    if (valido == true){
      return true;
    } else {
      return false;
    }
}

function validarTelefono(Telefono: string) {
    const expReg = /^[0-9]{9}$/;
    const valido = expReg.test(Telefono)
    if (valido == true){
      return true;
    } else {
      return false;
    }
}
 function validarCorreo(email: string){
    const expReg= /^[a-z0-9!#$%&'+/=?^`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/; 
    const valido = expReg.test(email);
    if(valido==true){
        return true;
    }else{
        return false;
    }
}
 
 export const postUser = async (context: postUser)=>{
    
    try{
    const usuario = context.request.body({ type: "json" })
    const value = await usuario.value;

    if(!value.email || !value.nombre || !value.apellido || !value.Telefono || !value.DNI){
        context.response.status = 400;
        return;
    }

    const telefonoValido = validarTelefono(value.Telefono);
    const correoValido = validarCorreo(value.email);
    const dniValidado = validarDNI(value.DNI)


    const user: userSchema | undefined = await AccesToUserCollection
    .findOne({
      $or: [
        { DNI: value.DNI },
        { Telefono: value.Telefono },
        { email:value.email },
      ]
    });
    const userNew = {...value, IBAN: "ES04" + `${randomIBAN}` }

    if(correoValido && telefonoValido && dniValidado){
        if(!user){
            await AccesToUserCollection.insertOne(userNew)
            context.response.status = 200
            context.response.body = {userNew}
        }else{
            context.response.status = 404;
            context.response.body = {
                message : "Email or telephone number or dni already en la database"
            }
        }
    }else{
        context.response.status = 404;
        context.response.body = {
            message : "Correo,telephone number or DNI not valid"
        }
    } 
}catch(e){
    context.response.status = 500;
    console.error(e)
}
 }