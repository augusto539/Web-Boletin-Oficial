import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const apollo = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:5050/graphql",
  }),
  cache: new InMemoryCache(),
});
