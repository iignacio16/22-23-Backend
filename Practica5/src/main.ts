import { ApolloServer } from "apolloServer";
import { startStandaloneServer } from "npm:@apollo/server@^4.1/standalone";
//import { graphql } from "npm:graphql@^16.6";

import { config } from "std/dotenv/mod.ts";


import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./schemaGQL.ts";

await config({ export: true, allowEmptyValues: true });

const resolvers = {
    Query,
    Mutation,
  };

  
const server = new ApolloServer({
    typeDefs,
    resolvers,
    });

    const port = Deno.env.get("PORT");

    if (!port) {
        throw new Error(
          "Missing environment variables, check env.sample for creating .env file"
        );
      }
    
    const { url } = await startStandaloneServer(server,{
    listen: { port: port },
    context: ({req}) => {
        const token = req.headers.token || ""
        const lang = req.headers.lang || ""
        return {
            token: token,
            lang: lang
        }
    }
    });
    
    console.log(`Server running on: ${url}`);