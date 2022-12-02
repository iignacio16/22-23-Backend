import { ApolloServer } from "apolloServer";
import { startStandaloneServer } from "npm:@apollo/server@^4.1/standalone";
import { graphql } from "npm:graphql@^16.6";

import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./schemaGQL.ts";

const resolvers = {
    Query,
    Mutation,
  };
  
const server = new ApolloServer({
    typeDefs,
    resolvers,
    });
    
    const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    });
    
    console.log(`Server running on: ${url}`);