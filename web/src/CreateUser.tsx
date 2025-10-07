import type React from "react";
import type { ConvertedUser } from "./types/types.ts";

const CreateUser: React.FC = () => {
  // deno-lint-ignore no-explicit-any
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const password = event.target.elements.password.value;
    // Handle form submission here, e.g. send data to server
    console.log(`Name: ${name}, Password: ${password}`);

    const newUserData: ConvertedUser = {
      "displayname": name,
      "credentials": name + ":" + password,
      "id": crypto.randomUUID(),
    };
    console.log(newUserData);
    fetch(import.meta.env.VITE_APIURL + "/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter your name:
        <input type="text" name="name" />
      </label>
      <label>
        Enter your password:
        <input type="password" name="password" />
      </label>
      <button type="submit">Create User</button>
    </form>
  );
};

export default CreateUser;
