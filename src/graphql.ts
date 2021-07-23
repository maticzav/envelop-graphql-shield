import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => "Hello world!"
  }
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
