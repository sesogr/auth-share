import React from "react";
import { Button, Input } from "antd";
import { useAuth } from "../Context/AuthContext.tsx";
import type { UserStringProperties } from "../types/ConvertedUser.ts";

const Change: React.FC<
  { toChange: UserStringProperties; password?: boolean }
> = (
  { toChange, password },
) => {
  const { user } = useAuth();
  const [newValue, setNewValue] = React.useState("");
  const [error, setError] = React.useState<Error | null>(null);
  const submit = async () => {
    if (!user) return;
    let newCred = newValue;
    let toChangeKey: UserStringProperties | "password" = toChange;
    if (toChange === "credentials") {
      newCred = user.displayname + ":" + newValue;
      toChangeKey = "password";
    }
    user[toChange] = newCred;
    try {
      const res = await fetch(
        import.meta.env.VITE_APIURL + "/user/me/" + toChangeKey,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(user),
        },
      );
      if (!res.ok) {
        throw new Error(
          `Failed to update user: ${res.status} ${res.statusText}`,
        );
      }
    } catch (e) {
      setError(e as Error);
      console.error("Error updating user:", e);
    }
  };
  return (
    <>
      <Input
        type={password ? "password" : "text"}
        placeholder={`New ${toChange}`}
        onChange={(e) => setNewValue(e.target.value)}
      />
      <Button
        onClick={() => submit()}
        type="primary"
        style={{ marginTop: 8 }}
      >
        Save Changes
      </Button>
      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
    </>
  );
};

export default Change;
