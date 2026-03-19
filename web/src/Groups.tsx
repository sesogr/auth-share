import React, { useState } from "react";
import { Button, Collapse, Input, List, Typography } from "antd";
import type { ReceivingConvertedGroup } from "./types/types.ts";
const { Panel } = Collapse;
const { Title } = Typography;

const Groups: React.FC<{ group: ReceivingConvertedGroup }> = ({ group }) => {
  const [value, setValue] = useState("");
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>{group.groupname}</Title>

      <Collapse accordion>
        <Panel header={`Groups (${group.users.length})`} key="users">
          <List
            dataSource={group.users}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>

        <Panel header={`Owners (1)`} key="owners">
          <List
            dataSource={[group.owner]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>

        <Panel
          header={`Sent Invitations (${group.sentInvitations.length})`}
          key="sentInvitations"
        >
          <List
            dataSource={group.sentInvitations}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>

        <Panel header={`Users (${group.users.length})`} key="users">
          <List
            dataSource={group.users}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Input onChange={(e) => setValue(e.target.value)} />
          <Button
            onClick={() => {
              group.users.push(value);
              console.log(group.users);
            }}
          >
            Add
          </Button>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Groups;
