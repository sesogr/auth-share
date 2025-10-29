import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Input, Row, Space } from "antd";
import type { SendingConvertedService } from "./types/ConvertedService.ts";

const CreateService: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  // deno-lint-ignore no-explicit-any
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const servicename = event.target.elements.servicename.value;
    const serviceUrl = event.target.elements.serviceUrl.value;
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    // Handle form submission here, e.g. send data to server
    console.log(
      `Name: ${servicename}, Username: ${username}, Password: ${password}`,
    );

    const newServiceData: SendingConvertedService = {
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
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Create a new Service
      </Button>
      <Drawer
        title="Create a new Service"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Close</Button>
            <Button
              //not working yet
              name="submitbutton"
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          //onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{
                  required: true,
                  message: "Please enter the Name for the Service",
                }]}
              >
                <Input placeholder="Please enter the Servicename" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="url"
                label="Service-Url"
                rules={[{ required: true, message: "Please enter the url" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  // addonBefore="http://"
                  // addonAfter=".com"
                  placeholder="example.org"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ServiceLogin"
                label="ServiceLogin"
                rules={[{
                  required: true,
                  message: "Please enter ServiceLogin",
                }]}
              >
                <Input placeholder="Please enter Displayname" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ServicePassword"
                label="ServicePassword"
                rules={[{
                  required: true,
                  message: "Please enter ServicePassword",
                }]}
              >
                <Input placeholder="Please enter ServicePassword" />
              </Form.Item>
            </Col>
          </Row>
          {
            /* <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "please enter url description",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="please enter url description"
                />
              </Form.Item>
            </Col>
          </Row> */
          }
        </Form>
      </Drawer>
    </>
  );
};

export default CreateService;
