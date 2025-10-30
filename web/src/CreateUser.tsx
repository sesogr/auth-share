import React from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import type { SendingConvertedUser } from "./types/ConvertedUser.ts";

const CreateUser: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: FormValues) => {
    const { name, password } = values;
    console.log("Form values:", values);

    const newUserData: SendingConvertedUser = {
      displayname: name,
      credentials: name + ":" + password,
      id: crypto.randomUUID(),
    };

    console.log("newUserData:", newUserData);

    try {
      const response = await fetch(`${import.meta.env.VITE_APIURL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });

      const data = response.status;
      console.log("Response:", data);
      message.success("User successfully created!");
      form.resetFields();
    } catch (error) {
      console.log("Error:", error);
      message.error("Failed to create user.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
              ]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUser;

type FormValues = {
  name: string;
  password: string;
};
