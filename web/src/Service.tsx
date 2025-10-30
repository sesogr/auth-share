import React from "react";
import { Collapse, List, Typography } from "antd";
import type { ReceivedConvertedService } from "./types/ConvertedService.ts";

const { Panel } = Collapse;
const { Title } = Typography;

const Service: React.FC<{ service: ReceivedConvertedService }> = (
  { service },
) => {
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
        </Panel>

        <Panel header={`Users (${service.users.length})`} key="users">
          <List
            dataSource={service.users}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>
      </Collapse>
    </div>
  );
};

export default Service;
