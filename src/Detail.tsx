import { gql, useQuery } from "@apollo/client";
import { Col, Container, Image, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

const GET_CHARACTER_BY_ID = gql`
  query ($id: ID!) {
    character(id: $id) {
      id
      name
      image
      species
      type
      gender
      status
      created
      origin {
        id
        created
        dimension
        type
      }
      episode {
        id
        name
        air_date
        episode
      }
    }
  }
`;

export default function Detail() {
  const { characterId } = useParams();
  const { loading, error, data } = useQuery(GET_CHARACTER_BY_ID, {
    variables: { id: characterId },
  });

  if (loading) return "loading...";
  if (error) return "error";

  return (
    <div className="m-4 w-25">
      <Link to={"/"} className="btn btn-link border mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-left"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        <span className="px-2">home</span>
      </Link>
      <div>
        <Image
          src={data.character.image}
          className=""
          alt={`${data.character.name}`}
        />
        <h1>{data.character.name}</h1>
        <h3>species {data.character.species}</h3>
      </div>
      <form>
        <div className="mb-3">
          <label className="form-label">Assign to a location</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Pluto"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
