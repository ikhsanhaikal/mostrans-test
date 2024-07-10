import { gql, useQuery } from "@apollo/client";
import { Alert, Image } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

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

  const [alert, setAlert] = useState<{
    variant: string;
    message: string;
  } | null>(null);

  const [location, setLocation] = useState("");
  const [assignedLocation, setAssignedLocation] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const docSnap = await getDoc(doc(db, "assignedIds", characterId));
      if (docSnap.exists()) {
        console.log("assignedLocation: ", docSnap.data());
        setAssignedLocation(docSnap.data().location);
      }
    })();
  }, []);

  if (loading) return "loading...";
  if (error) return "error";

  return (
    <div className="m-4 w-25">
      {alert !== null ? (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert(null)}
          dismissible
        >
          {alert.message}
        </Alert>
      ) : null}
      <Link to={"/"} className="btn btn-link border mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-left"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        <span>home</span>
      </Link>
      {assignedLocation !== null ? (
        <span className="badge text-bg-info my-3">
          was assigned to {assignedLocation}
        </span>
      ) : null}

      <div>
        <Image
          src={data.character.image}
          className=""
          alt={`${data.character.name}`}
        />
        <h1>{data.character.name}</h1>
        <h3>species {data.character.species}</h3>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("onSubmit was called");
          try {
            const docRef = doc(db, "assignedIds", characterId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              console.log("Document data:", docSnap.data());
              setAlert({
                message: `character \`${data.character.name}\` sudah diassign ke suatu lokasi`,
                variant: "danger",
              });
              return;
            } else {
              const docLocation = await getDoc(
                doc(db, "locations", location.toUpperCase())
              );
              if (docLocation.exists()) {
                console.log("exist");
                await updateDoc(docLocation.ref, {
                  charactersIds: arrayUnion(characterId),
                });
              } else {
                console.log("does not exist");
                await setDoc(doc(db, "locations", location.toUpperCase()), {
                  charactersIds: [characterId],
                });
              }
              await setDoc(doc(db, "assignedIds", characterId), {
                location: location,
              });

              setAlert({
                message: `character \`${data.character.name}\` berhasil diassign ke ${location}`,
                variant: "success",
              });
            }
            setLocation("");
          } catch (error) {
            setAlert({
              message: error.message,
              variant: "danger",
            });
            // console.error("Error adding document: ", e);
          }
        }}
      >
        <div className="mb-3">
          <label className="form-label">Assign to a location</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Pluto"
            value={location}
            onChange={(ev) => {
              setLocation(ev.target.value);
            }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => console.log("oucch")}
        >
          Submit
        </button>
      </form>
      <div className="py-2">
        {assignedLocation ? (
          <button
            className="btn btn-danger mt-0"
            onClick={async () => {
              try {
                await deleteDoc(doc(db, "assignedIds", characterId));
                await updateDoc(
                  doc(db, "locations", assignedLocation.toUpperCase()),
                  {
                    charactersIds: arrayRemove(characterId),
                  }
                );
                setAssignedLocation(null);
              } catch (error) {
                setAlert({
                  message: error.message,
                  variant: "danger",
                });
              }
            }}
          >
            Release it
          </button>
        ) : null}
      </div>
    </div>
  );
}
