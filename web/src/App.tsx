import { type JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home.tsx";
import Service from "./Service.tsx";
import User from "./User.tsx";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/:serviceName" element={<Home />} />
        <Route path="*" element={<div>Missing Page!!</div>} />
        <Route path="/owned" element={<Service />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
