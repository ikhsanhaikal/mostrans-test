import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";

export default function CardCharacter({ character }) {
  return (
    <div className="card border-0" style={{ width: "12rem" }}>
      <Link to={`/characters/${character.id}`}>
        <Image src={character.image} className="card-img-top" alt="..." />
        <div className="card-body px-0">
          <h5 className="card-title">{character.name}</h5>
          <p className="card-text">
            {character.type !== "" ? character.type : character.species}
          </p>
        </div>
      </Link>
    </div>
  );
}
