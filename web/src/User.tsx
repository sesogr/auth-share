import React, { useEffect, useState } from "react";
import type { ConvertedUser } from "./types/types.ts";
import { useParams } from "react-router-dom";
import { Descriptions } from "antd";

const User: React.FC = () => {
  const [user, setUserList] = useState<ConvertedUser>();
  const [error, setError] = useState<string | null>(null);
  //Deconstruction
  //const parameter = useParams();
  //const { userName } = parameter
  const { displayname } = useParams();

  useEffect(() => {
    fetch(import.meta.env.VITE_APIURL + "/user") // Port/Host anpassen
      .then((res): Promise<ConvertedUser> => {
        if (!res.ok) throw new Error("Netzwerkfehler");
        return res.json();
      })
      .then((data: ConvertedUser) => setUserList(data))
      .catch((err) => setError(err.message));
  }, []);
  if (error) return <div>Fehler: {error}</div>;
  if (!user) return <div>Lade...</div>;
  return (
    <div>
      <Descriptions
        title={<h1>My Site: {displayname}</h1>}
        items={[
          {
            key: "username",
            label: "Username",
            children: user?.credentials.replace(/:.*/, ""),
          },
          {
            key: "password",
            label: "Password",
            children: user?.credentials.replace(/^[^:]+:/, ""),
          },
        ]}
      />
      <div>
        <ul>
          <li>
            Your Credentials:
            <ul>
              {user?.credentials}
            </ul>
          </li>
          <li>
            Owned:{" "}
            <ul>
              {user.owned!.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </li>
          <li>
            Callable:{" "}
            <ul>
              {user.callable!.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </li>
          <li>
            Groups:{" "}
            <ul>
              {user.groups!.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
            <li>
              Group Invitations:
              <ul>
                {user.userGroupInvitations!.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
              <li>
                Owned Groups:
                <ul>
                  {user.ownedGroups!.map((e, i) => <li key={i}>{e}</li>)}
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
