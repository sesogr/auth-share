import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./Context/AuthContext.tsx";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
      <NavLink to="/" style={{ marginRight: 5 }}>Home</NavLink>

      <NavLink to="/groups" style={{ marginRight: 5 }}>Groups</NavLink>

      <NavLink
        to={user?.displayname
          ? `/user/${encodeURIComponent(user.displayname)}`
          : "/user"}
        style={{ marginRight: 5 }}
      >
        User
      </NavLink>
      {user
        ? (
          <>
            <span style={{ marginLeft: 12 }}>{user.credentials.username}</span>
            <button type="submit" onClick={logout} style={{ marginLeft: 8 }}>
              Logout
            </button>
          </>
        )
        : <NavLink to="/login" style={{ marginRight: 5 }}>Login</NavLink>}
    </nav>
  );
};

export default Navbar;
