import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";

const GET_CHARACTERS = gql`
  query ($page: Int) {
    characters(page: $page) {
      info {
        pages
        next
        prev
      }
      results {
        id
        name
        species
        gender
        image
      }
    }
  }
`;

function List() {
  const [page, setPage] = useState<number>(1);
  const { loading, error, data, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: {
      page: 1,
    },
  });

  useEffect(() => {
    console.log("page: ", page);
  }, [page]);

  if (error) {
    return <>error: {error.message}</>;
  }

  if (loading) {
    return <>loading...</>;
  }

  // console.log("data: ", data);

  // console.log("characters: ", data.characters.results);
  return (
    <Stack className="m-4">
      <h1>List page</h1>
      <ul>
        {data.characters.results
          .filter((el) => el.id > page * 20 - 20 && el.id <= page * 20)
          .map((c) => {
            return <li key={c.id}>{c.name}</li>;
          })}
        {/* {data.characters.results.slice(page * 20 - 20, page * 20).map((c) => {
          return <li key={c.id}>{c.name}</li>;
        })} */}
      </ul>
      <Pagination>
        {page > 1 ? (
          <Pagination.Prev onClick={() => setPage(page - 1)} />
        ) : null}

        {Array.from(Array(8).values()).map((_, idx) => {
          return (
            <Pagination.Item
              key={idx + 1}
              onClick={() => {
                setPage(idx + 1);
                fetchMore({
                  variables: {
                    page: idx + 1,
                  },
                }).then((value) => console.log("value: ", value));
              }}
              active={page === idx + 1}
            >
              {idx + 1}
            </Pagination.Item>
          );
        })}

        {page < 8 ? (
          <Pagination.Next onClick={() => setPage(page + 1)} />
        ) : null}
      </Pagination>
    </Stack>
  );
}

export default List;
