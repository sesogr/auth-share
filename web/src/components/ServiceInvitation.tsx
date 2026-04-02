import React, { useState } from "react";
import { Button, Input } from "antd";
import type { ConvertedService } from "../../../service/types/ConvertedService.ts";

const ServiceInvitation: React.FC<{ service: ConvertedService }> = (
  { service },
) => {
  const [inviteTarget, setInviteTarget] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const submit = () => {
    const value: ConvertedService = {
      id: service.id,
      sentInvitations: [inviteTarget],
    };
    fetch(
      import.meta.env.VITE_APIURL + "/service/invitation/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(value),
      },
    ).then(async (e) => setAnswer(await e.text())).catch((e) =>
      setError(e as Error)
    );
  };
  return (
    <>
      <Input
        type="text"
        placeholder="Invite Group"
        onChange={(e) => setInviteTarget(e.target.value)}
      />
      <Button onClick={() => submit()} type="primary" style={{ marginTop: 8 }}>
        Save
      </Button>
      {error && <div style={{ color: "red" }}>{error.message}</div>}
      {answer && <div style={{ color: "green" }}>{answer}</div>}
    </>
  );
};

export default ServiceInvitation;
