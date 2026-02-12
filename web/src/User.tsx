import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "./Context/AuthContext.tsx";

const User: React.FC = () => {
  const { displayname } = useParams();
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (displayname && user.displayname !== displayname) {
    return <div>Forbidden — das ist nicht dein Profil</div>;
  }

  return (
    <div>
      <h1>Profil: {displayname}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default User;
