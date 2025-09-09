import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    marginRight: 12,
    textDecoration: "none",
    color: isActive ? "DarkSlateGrey" : "black",
    fontWeight: isActive ? "600" : "400",
  });

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ffffffff" }}>
      <NavLink to="/" style={linkStyle}>
        Home
      </NavLink>
      <NavLink to="/user" style={linkStyle}>
        User
      </NavLink>
    </nav>
  );
};

export default Navbar;
