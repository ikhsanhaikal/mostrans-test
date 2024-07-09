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
  const [base, setBase] = useState<number>(1);
  const [leftiesPage, setLeftiesPage] = useState<number>(1);
  const [rightiesPage, setRightiesPage] = useState<number>(8);
  const { loading, error, data, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: {
      page: 1,
    },
  });

  useEffect(() => {
    console.log("page: ", page);
    fetchMore({
      variables: {
        page: page,
      },
    });
  }, [page, fetchMore]);

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
        {/* {page > 1 ? (
          <Pagination.Prev
            onClick={() => {
              if (page === leftiesPage) {
                setBase(base - 4);
              }
              setPage(page - 1);
            }}
          />
        ) : null} */}

        {Array.from(Array(8).values()).map((_, idx) => {
          const currPage = idx + base;
          if (currPage > 42) {
            return null;
          }
          return (
            <Pagination.Item
              key={idx}
              onClick={() => {
                setPage(currPage);
                if (idx === 7) {
                  setLeftiesPage(base + 4);
                  setRightiesPage(base + 4 + idx);
                  setBase(base + 4);
                } else if (idx === 0 && currPage !== 1) {
                  setLeftiesPage(base - 4);
                  setRightiesPage(base - 4 + idx);
                  setBase(base - 4);
                }
              }}
              active={page === currPage}
            >
              {currPage}
            </Pagination.Item>
          );
        })}

        {/* {data.characters.info.pages - rightiesPage > 1 ? (
          <Pagination.Next onClick={() => setPage(page + 1)} />
        ) : null} */}
      </Pagination>
    </Stack>
  );
}

export default List;
