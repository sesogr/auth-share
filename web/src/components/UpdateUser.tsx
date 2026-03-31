import React from "react";
import { Button, Input } from "antd";
import { useAuth } from "../Context/AuthContext.tsx";
import type { ConvertedUser, StringKeys } from "../types/types.ts";
import type { Credentials } from "../types/types.ts";

const Change: React.FC<
  { toChange: keyof ConvertedUser; password?: boolean }
> = (
  { toChange, password },
) => {
  const { user, refreshUser } = useAuth();
  const [newValue, setNewValue] = React.useState("");
  const [error, setError] = React.useState<Error | null>(null);
  const [answer, setAnswer] = React.useState<string | null>(null);
  const submit = async () => {
    setError(null);
    setAnswer(null);
    if (!user) return;
    let newCred: string | Credentials = newValue;
    let toChangeKey: StringKeys<ConvertedUser> = toChange as StringKeys<
      ConvertedUser
    >;
    if (toChange === "credentials") {
      newCred = {
        username: user.credentials.username,
        password: newCred,
      } as Credentials;
      toChangeKey = "password";
    }
    //@ts-ignore asdjk
    user[toChange] = newCred;
    try {
      const res = await fetch(
        import.meta.env.VITE_APIURL + "/user/me/" + toChangeKey,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(user),
        },
      );
      if (!res.ok) {
        const response = await res.text();
        setError(
          new Error(`Failed to update user: ${response}`),
        );
        console.error("Error updating user:" + response);
      } else {
        if (toChangeKey === "password") {
          user.credentials = { username: user.credentials.username };
        }
        refreshUser();
        setAnswer("User updated successfully");
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
      {error && <div style={{ color: "red" }}>{error.message}</div>}
      {answer && <div style={{ color: "green" }}>{answer}</div>}
    </>
  );
};

export default Change;
