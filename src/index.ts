import express from "express";
import { envelop, useSchema, useLogger } from "@envelop/core";
import playground from "graphql-playground-middleware-express";

import { schema } from "./graphql";

// MARK: - Config

const port = process.env.PORT || 4000;
const endpoint = "/graphql";

// MARK: - Envelop

const getEnveloped = envelop({
  plugins: [useSchema(schema), useLogger()]
});

// MARK: - Server

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi!");
});

// GraphiQL endpoint
app.get(endpoint, playground({ endpoint }));

// GraphQL endpoint
app.post(endpoint, async (req, res) => {
  const { parse, validate, contextFactory, execute, schema } = getEnveloped({
    req: req.body
  });

  // Parse the initial request and validate it
  const { query, variables } = req.body;
  const document = parse(query);
  const validationErrors = validate(schema, document);

  if (validationErrors.length > 0) {
    return res.end(JSON.stringify({ errors: validationErrors }));
  }

  // Build the context and execute
  const contextValue = await contextFactory();
  const result = await execute({
    document,
    schema,
    variableValues: variables,
    contextValue
  });

  // Send the response
  res.end(JSON.stringify(result));
});

// Start

app.listen({ port }, () => {
  console.log(`🚀  Server ready http://localhost:${port}`);
});
