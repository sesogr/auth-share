import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home.tsx";
import User from "./User.tsx";
import Navbar from "./Navbar.tsx";
import Register from "./Register.tsx";
import Login from "./Login.tsx";
import { AuthProvider, useAuth } from "./Context/AuthContext.tsx";

const UserRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user?.displayname) {
    return (
      <Navigate to={`/user/${encodeURIComponent(user.displayname)}`} replace />
    );
  }
  return <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<UserRedirect />} />
          <Route path="/user/:displayname" element={<User />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:serviceName" element={<Home />} />
          <Route path="*" element={<div>Missing Page!!</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

/*
-login.tsx anlegen -->
-
*/
