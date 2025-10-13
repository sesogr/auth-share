import type { ConvertedService } from "./types/ConvertedService.ts";

const CreateService: React.FC = () => {
  // deno-lint-ignore no-explicit-any
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const servicename = event.target.elements.servicename.value;
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    // Handle form submission here, e.g. send data to server
    console.log(
      `Name: ${servicename}, Username: ${username}, Password: ${password}`,
    );

    const newServiceData: ConvertedService = {
      "serviceName": servicename,
      "credentials": "username:password",
    };
    console.log(newServiceData);
    fetch(import.meta.env.VITE_APIURL + "/service/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newServiceData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.log(import.meta.env.VITE_APIURL);
        return console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter the Servicename:
        <input type="text" name="servicename" />
      </label>
      <label>
        Enter your username:
        <input type="text" name="username" />
      </label>
      <label>
        Enter your password:
        <input type="password" name="password" />
      </label>
      <button type="submit">Create Service</button>
    </form>
  );
};

export default CreateService;
