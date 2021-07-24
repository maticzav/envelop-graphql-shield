import { envelop, useSchema, useLogger } from '@envelop/core'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { altairExpress as playground } from 'altair-express-middleware'

import { schema } from './graphql'

// MARK: - Config

const port = process.env.PORT || 4000
const endpoint = '/graphql'

// MARK: - Envelop

const getEnveloped = envelop({
  plugins: [useSchema(schema), useLogger()],
})

// MARK: - Server

const app = express()

app.use(express.json())
app.use(session({ secret: 'very secret' }))
app.use(passport.initialize())
app.use(passport.session())

// Routes

app.get('/', (req, res) => {
  res.send('hi!')
})

app.get('/login', passport.authenticate('http'))

// GraphiQL endpoint
app.get(endpoint, playground({ endpointURL: endpoint }))

// GraphQL endpoint
app.post(endpoint, passport.authorize('http', {}), async (req, res) => {
  const { parse, validate, contextFactory, execute, schema } = getEnveloped({
    req: req.body,
  })

  // Parse the initial request and validate it
  const { query, variables } = req.body
  const document = parse(query)
  const validationErrors = validate(schema, document)

  if (validationErrors.length > 0) {
    return res.end(JSON.stringify({ errors: validationErrors }))
  }

  // Build the context and execute
  const contextValue = await contextFactory()
  const result = await execute({
    document,
    schema,
    variableValues: variables,
    contextValue,
  })

  // Send the response
  res.end(JSON.stringify(result))
})

// Start

app.listen({ port }, () => {
  console.log(`🚀  Server ready http://localhost:${port}`)
})
