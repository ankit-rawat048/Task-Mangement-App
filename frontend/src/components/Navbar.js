import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <style>{`
        .navbar {
          background-color: #2563eb;
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .navbar-title {
          font-size: 1.25rem;
          font-weight: bold;
        }
        .navbar-links a {
          padding: 0 0.75rem;
          color: white;
          text-decoration: none;
        }
        .navbar-links a:hover {
          text-decoration: underline;
        }
      `}</style>

      <nav className="navbar">
        <h1 className="navbar-title">Manage Task</h1>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/howto">How To</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/settings">Settings</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
