import { gql } from "graphql_tag";

export const typeDefs = gql`
 type Vendedor{
    id:ID!
    name:String!
    email:String!
    phone:String!
    cars: [Coche]!
}

type Coche {
    id:ID!
    brand:String!
    model:String!
    plate:String!
    price:Int!
    fabricationDate: String!
}

type Concesionario{
    id:ID!
    nombre:String!
    email:String!
    telefono:String!
    localizacion:String!
    vendedores:[Vendedor]!
}

type Query{
    getCoche(id: String, price: Int): Coche
    getCoches: [Coche!]!
    getVendedor(id: String, name: String):Vendedor
    getConcesionario(first: Int, skip: Int, id:ID, name:String, location:String):Concesionario
}

type Mutation{
    addVendedor(name: String!, email:String!, phone:String!): Vendedor!
    addCoche(brand:String!, model:String!, plate:String!, price:Int!, fabricationDate: String!): Coche!
    addConcesionario(nombre:String!, email:String!, telefono:String!, localizacion:String!): Concesionario!
    updateVendedor(plate: String!, id:String!): Vendedor!
    updateConcesionario(idConc:String!, id:String!): Concesionario!
}
`
