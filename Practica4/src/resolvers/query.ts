import { cocheCollection, concesionarioCollection, vendedorCollection } from "../db/dbConnect.ts";
import { Coche, Concesionario, Vendedor } from "../types.ts";
import { ObjectId } from "mongo";

export const Query = {
    getCoche: async (
        _: unknown,
        args: { id: string, price: number }
      ): Promise<Coche | null> => {
        try {
            const exists = await cocheCollection.findOne({
                $or:[
                    {_id: new ObjectId(args.id)},
                    {price:args.price}
                ]
            })
        
            if (exists) {
              return {
                ...exists,
                id: exists._id.toString()
              }
            }else{
              return null;
            }
            
          } catch (error) {
            console.error(error);
            throw new Error(error);
          }
      },
    getCoches: async(): Promise<Coche[]> =>{
        try{
          const coches = await cocheCollection.find().toArray();
          return coches.map((coche)=> ({...coche, id: coche._id.toString()}));
        }catch(error){
          console.error(error);
          throw new Error(error)
        }
      },
    getVendedor: async (
      _: unknown,
      args: {id: string, name: string }
    ): Promise<Vendedor |null> => {
      try{
        const vendedor = await vendedorCollection.findOne({$or: [{name: args.name}, { _id: new ObjectId(args.id) }]})
        
        if(vendedor){
          return{
            ...vendedor,
            id: vendedor._id.toString(),
            cars: []
          }
        }else {
          return null;
        }
      } catch (error) {
            console.error(error);
            throw new Error(error);
          }
    },
    getConcesionario:async (
      _: unknown,
      args: {id: string, name: string, location: string, first: number, skip: number}
    ): Promise<Concesionario | null> => {
      try{
        let query = await concesionarioCollection.find({});
        if (args.first) query = query.limit(args.first);
        if (args.skip) query = query.skip(args.skip);  
        const concesionario = await concesionarioCollection.findOne({$or: [{name: args.name}, { _id: new ObjectId(args.id) }, {location: args.location}]})
        if(concesionario){
          return{
            ...concesionario,
            id: concesionario._id.toString(),
            vendedores: []
            
          }
        }else {
          return null;
        }
        

      } catch (error) {
            console.error(error);
            throw new Error(error);
          }
    }
}