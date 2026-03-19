import React, { useState } from "react";
import { Form } from "antd";
import type { ConvertedGroup } from "../../../service/src/types/ConvertedGroup.ts";
import { MyDrawerForm } from "./MyDrawerForm.tsx";

const CreateGroup: React.FC = () => {
  const openState = useState(false);

  const [form] = Form.useForm();
  const handleSubmit = (values: { name: string }) => {
    const displayname = values.name;
    console.log(values);
    const newGroupData: ConvertedGroup = {
      groupname: displayname,
    };
    console.log(newGroupData);
    fetch(import.meta.env.VITE_APIURL + "/group/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGroupData),
    })
      .then((response) => {
        form.resetFields();
        return response.status;
      });
  };
  return (
    <MyDrawerForm
      onFinish={(values) => handleSubmit(values)}
      openState={openState}
      form={form}
      title="Create a new Group"
      formItems={["Name"]}
      type="group"
    />
  );
};

export default CreateGroup;
