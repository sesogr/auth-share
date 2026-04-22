import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home.tsx";
import User from "./User.tsx";
import Navbar from "./Navbar.tsx";
import Register from "./Register.tsx";
import Login from "./Login.tsx";
import { AuthContext, AuthProvider, useAuth } from "./Context/AuthContext.tsx";
import GroupPage from "./GroupPage.tsx";
import { ConfigProvider, theme } from "antd";

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
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const updateTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  useEffect(() => {
    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
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
                    <Route path="/groups" element={<GroupPage />} />
                    <Route path="/groups/:groupname" element={<GroupPage />} />
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
    </ConfigProvider>
  );
};

export default App;
