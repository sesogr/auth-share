import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "./Context/AuthContext.tsx";
import { Button, List } from "antd";
import type { UserStringProperties } from "./types/ConvertedUser.ts";
import Change from "./components/UpdateUser.tsx";
const User: React.FC = () => {
  const { displayname } = useParams();
  const { user } = useAuth();
  const displaynameState = React.useState(false);
  const passwordState = React.useState(false);
  const states: [boolean, React.Dispatch<React.SetStateAction<boolean>>][] = [
    displaynameState,
    passwordState,
  ];
  const [displaynameEdit, setDisplaynameEdit] = displaynameState;
  const [passwordEdit, setPasswordEdit] = passwordState;
  const toggleEditBox = (which: UserStringProperties) => {
    states.forEach(([_, setState]) => {
      setState(false);
    });
    switch (which) {
      case "displayname":
        setDisplaynameEdit((e) => !e);
        break;
      case "credentials":
        setPasswordEdit((e) => !e);
        break;
    }
  };
  if (!user) return <Navigate to="/login" replace />;
  if (displayname && user.displayname !== displayname) {
    return <Navigate to="/user" replace />;
  }

  return (
    <>
      <h1>Profil: {displayname}</h1>
      <List bordered>
        <List.Item>
          Display Name: {user.displayname}
          <Button onClick={() => toggleEditBox("displayname")}>
            Change Display Name
          </Button>
          {displaynameEdit && <Change toChange="displayname" />}
        </List.Item>
        <List.Item>
          Credentials
          <Button onClick={() => toggleEditBox("credentials")}>
            Change Password
          </Button>
          {passwordEdit && <Change password toChange="credentials" />}
        </List.Item>
        <List.Item>
          Services: {user.callable.join(", ")}
        </List.Item>
        <List.Item>
          Groups: {user.groups.join(", ")}
        </List.Item>
      </List>
    </>
  );
};

export default User;
