import { cocheCollection, concesionarioCollection, vendedorCollection } from "../db/dbConnect.ts";
import { Coche, Concesionario, Vendedor } from "../types.ts";
import { ObjectId } from "mongo";

function validarCorreo(email: string){
    const expReg= /^[a-z0-9!#$%&'+/=?^`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/; 
    return expReg.test(email);
}

function validarTelefono(Telefono: string) {
    const expReg = /^[0-9]{9}$/;
    return expReg.test(Telefono);
}

function validarMatricula(Matricula: string) {
    const expReg = /^[0-9]{4}[A-Z]{3}$/;
    return expReg.test(Matricula);
}

export const Mutation = {
    addVendedor: async(
        _:unknown,  
        args:{name:string, email:string, phone:string}
        ): Promise<Vendedor> => {
            try{
            const vendedorExists = await vendedorCollection.findOne({ 
                $or: [
                {email : args.email},
                {phone: args.phone}]});
            
                const correoValido = validarCorreo(args.email)
                const telefonoValido = validarTelefono(args.phone)
                
            if (vendedorExists) {
                throw new Error("el vendedor ya esta en la base de datos");
            }
            if(!correoValido || !telefonoValido){
                throw new Error("argumentos invalidos")
            }else{
                const vendedor = await vendedorCollection.insertOne({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                    cars: []
            });
            
            return {
                id: vendedor.toString(),
                name: args.name,
                email: args.email,
                phone: args.phone,
                cars: []
            }
        }
            } catch (error) {
            console.error(error);
            throw new Error(error);
            }
        },

        addCoche: async(
            _:unknown,
            args:{brand: string, model: string, plate:string, price:number, fabricationDate: string}
        ): Promise<Coche> =>{
            try{
            const Fecha = new Date(args.fabricationDate).toISOString()
            const cocheExists = await cocheCollection.findOne({plate: args.plate});

            if(cocheExists){
                throw new Error("Matricula ya existente en la base de datos")
            }
            
            const matriculaValidada = validarMatricula(args.plate);

            if(!matriculaValidada){
                throw new Error("argumentos invalidos")
            }else{

                const newCoche = await cocheCollection.insertOne({
                    ...args,
                    fabricationDate: Fecha
                })

                return{
                    id: newCoche.toString(),
                    brand: args.brand,
                    plate: args.plate,
                    model: args.model,
                    price: args.price,
                    fabricationDate: Fecha
                }
            }

            }catch(error){
            console.error(error);
            throw new Error(error);
            }
        },

        addConcesionario: async(
            _:unknown,
            args:{nombre:string, email:string, telefono:string, localizacion:string}
        ): Promise<Concesionario> =>{
            try{
            const concesionarioExists = await concesionarioCollection.findOne({nombre: args.nombre});

            if(concesionarioExists){
                throw new Error("Concesionario ya existente en la base de datos")
            }
            
            const correoValido = validarCorreo(args.email)
            const telefonoValido = validarTelefono(args.telefono)

            if(!telefonoValido || !correoValido){
                throw new Error("argumentos invalidos")
            }else{

                const newConcesionario = await concesionarioCollection.insertOne({
                    ...args,
                    vendedores: []
                })

                return{
                    id: newConcesionario.toString(),
                    nombre: args.nombre,
                    email: args.email,
                    telefono: args.telefono,
                    localizacion: args.localizacion,
                    vendedores: []
                }
            }

            }catch(error){
            console.error(error);
            throw new Error(error);
            }
        },

        updateVendedor: async(
            _:unknown,
            args:{plate:string, id:string}
        ): Promise<Vendedor> => {
            try{
                const coche = await cocheCollection.findOne({plate: args.plate});
                const vendedor = await vendedorCollection.findOne({_id: new ObjectId(args.id)})

                if(!coche || !vendedor){
                    throw new Error("No tenemos registrado este coche")
                }

                await vendedorCollection.updateOne(
                    {_id: vendedor._id},
                    { $push:{
                        cars:{
                            $each: [coche._id.toString()]
                        }  
                    }}
                )
                const vend = await vendedorCollection.findOne({_id: new ObjectId(args.id)})
                return{
                    id: vend!._id.toString(),
                    name: vend!.name,
                    email: vend!.email,
                    phone: vend!.phone,
                    cars: vend!.cars
                }

            }catch(error){
            console.error(error);
            throw new Error(error);
            }
        },

        updateConcesionario: async(
            _:unknown,
            args:{idConc:string, id:string}
        ): Promise<Concesionario> => {
            try{
                const concesionario = await concesionarioCollection.findOne({_id: new ObjectId(args.idConc)})
                const vendedor = await vendedorCollection.findOne({_id: new ObjectId(args.id)});

                if(!concesionario|| !vendedor){
                    throw new Error("No tenemos registrado este concesionario o este vendedor")
                }

                await concesionarioCollection.updateOne(
                    {nombre: concesionario.nombre},
                    { $push:{
                        vendedores:{
                            $each: [vendedor._id.toString()]
                        }  
                    }}
                )
                const conc = await concesionarioCollection.findOne({_id: new ObjectId(args.id)});
                return{
                    id: conc!._id.toString(),
                    nombre: conc!.nombre,
                    email: conc!.email,
                    telefono: conc!.telefono,
                    localizacion: conc!.localizacion,
                    vendedores: conc!.vendedores
                }

            }catch(error){
            console.error(error);
            throw new Error(error);
            }
        },
        
}
