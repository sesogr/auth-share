import React from "react";
import { Button, Col, Drawer, Form, Input, Row, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";

type MyDrawerFormParams = {
  form: FormInstance;
  //TODO
  // deno-lint-ignore no-explicit-any
  onFinish: (values: any) => void;
  title: string;
  type: string;
  formItems: string[];
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  error: string | null;
};
export const MyDrawerForm: React.FC<
  MyDrawerFormParams
> = (props: MyDrawerFormParams) => {
  const [open, setOpen] = props.openState;
  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        icon={<PlusOutlined />}
      >
        {props.title}
      </Button>
      <Drawer
        title={props.title}
        width={720}
        onClose={() => setOpen(false)}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button
              name="submitbutton"
              type="primary"
              htmlType="submit"
              onClick={() => props.form.submit()}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          form={props.form}
          layout="vertical"
          onFinish={props.onFinish}
          //onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            {props.formItems.map((item: string) => {
              return (
                <Col span={12}>
                  <Form.Item
                    key={item}
                    name={item.toLowerCase()}
                    label={item}
                    rules={[{
                      required: true,
                      message: `Please enter the ${item} for the ${props.type}`,
                    }]}
                  >
                    <Input
                      placeholder={`Please enter the ${props.type}${item.toLowerCase()}`}
                    />
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Form>
        {props.error && <p style={{ color: "red" }}>{props.error}</p>}
      </Drawer>
    </>
  );
};
