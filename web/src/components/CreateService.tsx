import React, { useState } from "react";
import { Form } from "antd";
import type { ConvertedService } from "../types/types.ts";
import { MyDrawerForm } from "./MyDrawerForm.tsx";

const CreateService: React.FC<{ addReload: () => void }> = ({ addReload }) => {
  const openState = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = (values: FormValues) => {
    console.log(values);
    const serviceName = values.name;
    const serviceUrl = values.url;
    const username = values.username;
    const password = values.password;

    const newServiceData: ConvertedService = {
      "serviceName": serviceName,
      "serviceUrl": serviceUrl,
      "credentials": {
        username: username,
        password: password,
      },
    };
    console.log(newServiceData);
    return fetch(import.meta.env.VITE_APIURL + "/service/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newServiceData),
    })
      .then((response) => {
        if (response.status !== 204) {
          return response.text();
        } else {
          form.resetFields();
        }
      }).catch((e) => setError(e));
  };

  return (
    <MyDrawerForm
      onFinish={(values) => {
        handleSubmit(values).then(() => addReload());
      }}
      openState={openState}
      title="Create a new Service"
      form={form}
      formItems={["Name", "Url", "Username", "Password"]}
      type="service"
      error={error}
    />
  );
};

export default CreateService;
type FormValues = {
  name: string;
  url: string;
  username: string;
  password: string;
};
