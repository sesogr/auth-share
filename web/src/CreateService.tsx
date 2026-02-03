import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Input, message, Row, Space } from "antd";
import type { SendingConvertedService } from "./types/ConvertedService.ts";

const CreateService: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const handleSubmit = (values: FormValues) => {
    //[Log] {name: "hsdf", url: "dkfhg", ServiceLogin: "lakjs", ServicePassword: "123455"} (CreateService.tsx, line 32)
    const servicename = values.name;
    const serviceUrl = values.url;
    const username = values.serviceLogin;
    const password = values.servicePassword;
    // Handle form submission here, e.g. send data to server
    console.log(values);

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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newServiceData),
    })
      .then((response) => response.status)
      .then((data) => {
        form.resetFields();
        message.success("Service created");
        return console.log(data);
      })
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
              onClick={() => form.submit()}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
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
                name="serviceLogin"
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
                name="servicePassword"
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
type FormValues = {
  name: string;
  url: string;
  serviceLogin: string;
  servicePassword: string;
};
