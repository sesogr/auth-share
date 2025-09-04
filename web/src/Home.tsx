import React, { useEffect, useState } from "react";
import type { ConvertedService } from "./types/ConvertedService.ts";
import { Link } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState<ConvertedService[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("http://localhost:8000/user/owned") // Port/Host anpassen
      .then((res): Promise<ConvertedService[]> => {
        if (!res.ok) throw new Error("Netzwerkfehler");
        return res.json();
      })
      .then((data: ConvertedService[]) => setUsers(data))
      .catch((err) => setError(err.message));
  }, []);
  if (error) return <div>Fehler: {error}</div>;
  if (!users) return <div>Lade...</div>;

  return (
    <div>
      <h1>Service List</h1>
      <ul>
        {users.map((u) => (
          <li>
            <Link to="/owned">{u.serviceName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
