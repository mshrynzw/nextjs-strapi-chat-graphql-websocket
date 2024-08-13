// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"

const httpLink = new HttpLink({
  uri : "http://localhost:1337/graphql" // StrapiのGraphQLエンドポイント
})

const wsLink = new WebSocketLink({
  uri : `ws://localhost:1337/graphql`,
  options : {
    reconnect : true
  }
})

// リクエストの種類に応じてリンクを分割
const splitLink = split(({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link : splitLink,
  cache : new InMemoryCache()
})

export default client