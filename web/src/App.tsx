import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home.tsx";
import User from "./User.tsx";
import Navbar from "./Navbar.tsx";
import CreateUser from "./CreateUser.tsx";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/:serviceName" element={<Home />} />
        <Route path="*" element={<div>Missing Page!!</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
