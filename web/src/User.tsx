import React, { useEffect, useState } from "react";
import type { ConvertedUser } from "./types/types.ts";
import { useParams } from "react-router-dom";

const User = () => {
  const [userList, setUserList] = useState<ConvertedUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  //Deconstruction
  //const parameter = useParams();
  //const { userName } = parameter
  const { displayname } = useParams();

  useEffect(() => {
    fetch("http://localhost:8000/user") // Port/Host anpassen
      .then((res): Promise<ConvertedUser[]> => {
        if (!res.ok) throw new Error("Netzwerkfehler");
        return res.json();
      })
      .then((data: ConvertedUser[]) => setUserList(data))
      .catch((err) => setError(err.message));
  }, []);
  if (error) return <div>Fehler: {error}</div>;
  if (!userList) return <div>Lade...</div>;

  const user = userList[0];

  return (
    <div>
      <h1>My Site: {displayname}</h1>
      <div>
        <ul>
          <li>
            Your Credentials:
            <ul>
              {user?.credentials.username + ":" + user?.credentials.password}
            </ul>
          </li>
          <li>
            Owned:{" "}
            <ul>
              {user?.owned.map((e) => <li>{e}</li>)}
            </ul>
          </li>
          <li>
            Callable:{" "}
            <ul>
              {user?.callable.map((e) => <li>{e}</li>)}
            </ul>
          </li>
          <li>
            Groups:{" "}
            <ul>
              {user?.groups.map((e) => <li>{e}</li>)}
            </ul>
            <li>
              Group Invitations:
              <ul>
                {user?.userGroupInvitations.map((e) => <li>{e}</li>)}
              </ul>
              <li>
                Owned Groups:
                <ul>
                  {user?.ownedGroups.map((e) => <li>{e}</li>)}
                </ul>
              </li>
            </li>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default User;
