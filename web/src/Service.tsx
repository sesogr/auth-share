import React, { useState } from "react";
import { Button, Collapse, Input, List, Typography } from "antd";
import type { ReceivingConvertedService } from "./types/types.ts";
import ServiceInvitation from "./components/ServiceInvitation.tsx";

const { Panel } = Collapse;
const { Title } = Typography;

const Service: React.FC<{ service: ReceivingConvertedService }> = (
  { service },
) => {
  const [value, setValue] = useState<string>("");
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>{service.serviceName}</Title>

      <Collapse accordion>
        <Panel header={`Groups (${service.groups.length})`} key="groups">
          <List
            dataSource={service.groups}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>

        <Panel header={`Owners (${service.owners.length})`} key="owners">
          <List
            dataSource={service.owners}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>

        <Panel
          header={`Sent Invitations (${service.sentInvitations.length})`}
          key="sentInvitations"
        >
          <List
            dataSource={service.sentInvitations}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <ServiceInvitation service={service} />
        </Panel>

        <Panel header={`Users (${service.users.length})`} key="users">
          <List
            dataSource={service.users}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Input onChange={(e) => setValue(e.target.value)} />
          <Button
            onClick={() => {
              service.users.push(value);
              console.log(service.users);
            }}
          >
            Add
          </Button>
        </Panel>
        <Button
          onClick={() => {
            fetch(import.meta.env.VITE_APIURL + "/service/users", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(service),
            }).then(async (e) => console.log(await e.json()));
          }}
        >
          Confirm Changes
        </Button>
      </Collapse>
    </div>
  );
};

export default Service;
