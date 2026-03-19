import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./Context/AuthContext.tsx";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    marginRight: 12,
    textDecoration: "none",
    color: isActive ? "DarkSlateGrey" : "black",
    fontWeight: isActive ? "600" : "400",
  });

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
      <NavLink to="/" style={linkStyle}>Home</NavLink>
      <NavLink to="/groups" style={linkStyle}>Groups</NavLink>
      <NavLink
        to={user?.displayname
          ? `/user/${encodeURIComponent(user.displayname)}`
          : "/user"}
        style={linkStyle}
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
        : <NavLink to="/login" style={linkStyle}>Login</NavLink>}
    </nav>
  );
};

export default Navbar;
