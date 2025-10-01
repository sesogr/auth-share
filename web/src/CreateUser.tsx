import type React from "react";

const CreateUser: React.FC = () => {
  // deno-lint-ignore no-explicit-any
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const password = event.target.elements.password.value;
    // Handle form submission here, e.g. send data to server
    console.log(`Name: ${name}, Password: ${password}`);
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
