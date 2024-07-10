import { gql, useQuery } from "@apollo/client";
import { Link, useLocation, useParams } from "react-router-dom";

const GET_MULTIPLE_CHARACTERS = gql`
  query ($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      id
      name
      type
      gender
    }
  }
`;
export default function Package() {
  const { location } = useParams();
  const { state } = useLocation();
  // console.log("ids: ", state.ids);
  const { loading, error, data } = useQuery(GET_MULTIPLE_CHARACTERS, {
    variables: {
      ids: state.ids,
    },
  });

  if (loading) {
    return <h3>loading for characters with location {location}</h3>;
  }
  // console.log("data: ", data);

  if (error) {
    return <h3>error {error.message}</h3>;
  }

  return (
    <div className="m-4">
      <h3>{location}</h3>
      <ul>
        {data.charactersByIds.map((c) => {
          return (
            <Link key={c.id} to={`/characters/${c.id}`}>
              <div>
                <h5> {c.name} </h5>
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
