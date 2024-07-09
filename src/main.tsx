import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        characters: {
          keyArgs: false,
          // read(existing, { args: { page, limit = 20 } }) {
          // A read function should always return undefined if existing is
          // undefined. Returning undefined signals that the field is
          // missing from the cache, which instructs Apollo Client to
          // fetch its value from your GraphQL server.
          // return existing;
          // if (existing === undefined) {
          //   return existing;
          // } else {
          // }
          // return existing && existing.slice(offset, offset + limit);
          // },
          merge(existing = null, incoming, { args: { page } }) {
            if (!existing) {
              return { visitedPage: [page], ...incoming };
            } else {
              if (existing.visitedPage.includes(page)) {
                return existing;
              }
              return {
                ...incoming,
                visitedPage: [...existing.visitedPage, page],
                results: [...existing.results, ...incoming.results],
              };
            }
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql",
  cache: cache,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
