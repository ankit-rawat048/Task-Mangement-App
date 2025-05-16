import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <style>
        {`
          .navbar {
            background-color: #007bff;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .navbar-title {
            font-size: 1.5rem;
            font-weight: bold;
          }

          .navbar-links a {
            color: white;
            text-decoration: none;
            margin-left: 1.5rem;
            font-size: 1rem;
            transition: color 0.3s ease;
          }

          .navbar-links a:hover {
            color: #cce5ff;
          }

          @media (max-width: 600px) {
            .navbar {
              flex-direction: column;
              align-items: flex-start;
            }

            .navbar-links {
              margin-top: 0.5rem;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            }

            .navbar-links a {
              margin-left: 0;
            }
          }
        `}
      </style>

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
