import React, { useState } from "react";
import { Form } from "antd";
import type { ConvertedGroup } from "../../../service/src/types/ConvertedGroup.ts";
import { MyDrawerForm } from "./MyDrawerForm.tsx";

const CreateGroup: React.FC<
  { addReload: () => void }
> = (
  { addReload },
) => {
  const openState = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        if (response.status !== 204) {
          return response.text();
        } else {
          form.resetFields();
        }
      }).then((e) => e ? setError(e) : null).catch((e) => setError(e));
  };
  return (
    <MyDrawerForm
      onFinish={(values) => {
        handleSubmit(values);
        addReload();
      }}
      openState={openState}
      form={form}
      title="Create a new Group"
      formItems={["Name"]}
      type="group"
      error={error}
    />
  );
};

export default CreateGroup;
