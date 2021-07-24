import gql from 'graphql-tag'
import { makeExecutableSchema } from '@graphql-tools/schema'

/**
 * This file contains everything related to our GraphQL Schema.
 */

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: (root, args, context) => 'Hello world!!',
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
