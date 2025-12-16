import React from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import type { SendingConvertedUser } from "./types/ConvertedUser.ts";

const Register: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: FormValues) => {
    const { username, displayname, password } = values;
    console.log("Form values:", values);

    const newUserData: SendingConvertedUser = {
      displayname: displayname,
      credentials: username + ":" + password,
    };

    console.log("newUserData:", newUserData);

    try {
      const response = await fetch(import.meta.env.VITE_APIURL + "/register", {
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
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please enter your Username",
                },
              ]}
            >
              <Input placeholder="Enter your Username" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="displayname"
              label="Displayname"
              rules={[
                {
                  required: true,
                  message: "Please enter your Displayname",
                },
              ]}
            >
              <Input placeholder="Enter your Displayname" />
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

export default Register;

type FormValues = {
  username: string;
  displayname: string;
  password: string;
};
