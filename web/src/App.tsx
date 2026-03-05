import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home.tsx";
import User from "./User.tsx";
import Navbar from "./Navbar.tsx";
import Register from "./Register.tsx";
import Login from "./Login.tsx";
import { AuthContext, AuthProvider, useAuth } from "./Context/AuthContext.tsx";

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
        <AuthContext.Consumer>
          {(user) =>
            user?.isAuthenticated
              ? (
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/user" element={<UserRedirect />} />
                  <Route path="/user/:displayname" element={<User />} />
                  <Route path="/:serviceName" element={<Home />} />
                  <Route path="*" element={<div>Missing Page!!</div>} />
                </Routes>
              )
              : (
                <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Login />} />
                </Routes>
              )}
        </AuthContext.Consumer>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

/*
-login.tsx anlegen -->
-
*/
