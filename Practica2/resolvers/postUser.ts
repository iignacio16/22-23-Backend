import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { BODY_TYPES } from "https://deno.land/x/oak@v11.1.0/util.ts";
import { AccesToUserCollection } from "../db/mongo.ts";
import { userSchema } from "../db/schemas.ts";

type postUser = RouterContext <"/user", Record<string | number, string | undefined>,
 Record<string, any>>

 const randomIBAN = (Math.floor(100000000000000000000 + Math.random() * 900000000000000000000))
 
 const validarDNI = (dni: any) =>{

    const expresion_regular_dni = /^\d{8}[a-zA-Z]$/;
   
    if(expresion_regular_dni.test (dni) == true){
       const num = dni.substr(0,dni.length-1);
       const letr = dni.substr(dni.length-1,1);
       const numero = num % 23;
       let letra='TRWAGMYFPDXBNJZSQVHLCKET';
       letra=letra.substring(numero,numero+1);
      if (letra!=letr.toUpperCase()) {
         //alert('Dni erroneo, la letra del NIF no se corresponde');
         return false
       }else{
         //alert('Dni correcto');
         return true
       }
    }else{
       //alert('Dni erroneo, formato no válido');
       return false
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

    const dniValido = validarDNI(value.DNI);
    const correoValido = validarCorreo(value.email);


    const Udni :userSchema | undefined = await AccesToUserCollection.findOne({ DNI: value.DNI })
    const Utlf: userSchema | undefined= await AccesToUserCollection.findOne({ Telefono: value.Telefono })
    const Uemail : userSchema | undefined= await AccesToUserCollection.findOne({ email: value.email })
    const userNew = {...value, IBAN: "ES04" + `${randomIBAN}` }

    if(correoValido){
        if(!Uemail && !Udni && !Utlf ){
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
            message : "Correo no valido"
        }
    } 
}catch(e){
    context.response.status = 500;
    console.error(e)
}
 }