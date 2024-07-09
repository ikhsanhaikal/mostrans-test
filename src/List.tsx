import { gql, useQuery } from "@apollo/client";

const GET_CHARACTERS = gql`
  query ($page: Int) {
    characters(page: $page) {
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
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: {
      page: 1,
    },
  });

  if (error) {
    return <>error: {error.message}</>;
  }

  if (loading) {
    return <>loading...</>;
  }

  return (
    <div>
      <h1>List page</h1>
      <ul>
        {data.characters.results.map((c) => {
          return <li>{c.name}</li>;
        })}
      </ul>
    </div>
  );
}

export default List;
