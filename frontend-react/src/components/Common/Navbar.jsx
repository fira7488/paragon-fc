import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          PARAGON<span>FC</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link
            to="/standings"
            className={location.pathname === "/standings" ? "active" : ""}
          >
            Standings
          </Link>
          <Link
            to="/gallery"
            className={location.pathname === "/gallery" ? "active" : ""}
          >
            Gallery
          </Link>
          {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
          {isAuthenticated ? (
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          ) : (
            <Link to="/admin" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
