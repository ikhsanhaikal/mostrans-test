import {
  collection,
  doc,
  DocumentData,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import Package from "./Package";
import { Link } from "react-router-dom";

export default function CharactersByLocation() {
  const [snapshot, setSnapshot] = useState<QuerySnapshot<
    DocumentData,
    DocumentData
  > | null>(null);

  useEffect(() => {
    (async function () {
      const querySnapshot = await getDocs(collection(db, "locations"));
      setSnapshot(querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log("doc index: ", doc.id);
        console.log("doc: ", doc.data());
      });
    })();
  }, []);

  if (snapshot?.empty) {
    return <h3>There's nothing to see here</h3>;
  }

  return (
    <>
      <ul>
        {snapshot?.docs.map((doc) => {
          // console.log("data: ", doc.data().charactersIds);
          return (
            <Link
              key={doc.id}
              to={`${doc.id}`}
              state={{ ids: doc.data().charactersIds }}
              className="d-block"
            >
              {doc.id}
            </Link>
          );
        })}
      </ul>
    </>
  );
}
