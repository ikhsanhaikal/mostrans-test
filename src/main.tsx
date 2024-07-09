import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Detail from "./Detail.tsx";
import List from "./List.tsx";
import CharacterByLocation from "./CharacterByLocation.tsx";
import Package from "./Package.tsx";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<List />} />
            <Route path="characters/:characterId" element={<Detail />} />
            <Route
              path="characters-by-location"
              element={<CharacterByLocation />}
            />
            <Route
              path="characters-by-location/:location"
              element={<Package />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
