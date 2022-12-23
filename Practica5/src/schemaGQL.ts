import { gql } from "graphql_tag";

export const typeDefs = gql`
type Usuario {
    id: ID!
    username:String!
    password:String!
    created_at: String!
    language: String!
    token: String
}

type Menssage {
    sender: String!
    message: String!
    language: String!
    created_at: String!
}

type Query {
    createUser(username:String!, password:String!): Usuario!
}

type Mutation{
    createUser(username:String!, password:String!): Usuario!
    login(username:String!, password:String!): String!
    deleteUser: Usuario!
}
`;