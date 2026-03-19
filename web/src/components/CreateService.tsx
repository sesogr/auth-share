import React, { useState } from "react";
import { Form } from "antd";
import type { ConvertedService } from "../types/types.ts";
import { MyDrawerForm } from "./MyDrawerForm.tsx";

const CreateService: React.FC<
  {
    serviceList: ConvertedService[];
  }
> = ({ serviceList }) => {
  const openState = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    const servicename = values.name;
    const serviceUrl = values.url;
    const username = values.username;
    const password = values.password;

    const newServiceData: ConvertedService = {
      "serviceName": servicename,
      "serviceUrl": serviceUrl,
      "credentials": {
        username: username,
        password: password,
      },
    };
    console.log(newServiceData);
    fetch(import.meta.env.VITE_APIURL + "/service/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newServiceData),
    })
      .then((response) => response.status)
      .then((data) => {
        form.resetFields();
        serviceList.push({
          serviceName: servicename,
          serviceUrl: serviceUrl,
          credentials: {
            username: username,
            password: password,
          },
        });

        return console.log(data);
      })
      .catch((error) => {
        console.log(import.meta.env.VITE_APIURL);
        return console.error(error);
      });
  };

  return (
    <MyDrawerForm
      onFinish={(values) => handleSubmit(values)}
      openState={openState}
      title="Create a new Service"
      form={form}
      formItems={["Name", "Url", "Username", "Password"]}
      type="service"
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
