import React, { useState, type JSX } from "react";
import type { ConvertedUser } from "./types/types.ts";

function App(): JSX.Element {
  const [users, setUsers] = useState<ConvertedUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  fetch("http://localhost:8000/user") // Port/Host anpassen
    .then((res): Promise<ConvertedUser[]> => {
      if (!res.ok) throw new Error("Netzwerkfehler");
      return res.json();
    })
    .then((data: ConvertedUser[]) => setUsers(data))
    .catch((err) => setError(err.message));

  if (error) return <div>Fehler: {error}</div>;
  if (!users) return <div>Lade...</div>;

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((u) => (
          <li>{u.displayname}</li>
        ))}
      </ul>
    </div>
  );
}
export default App;
