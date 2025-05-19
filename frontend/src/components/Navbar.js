import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        .navbar {
          background-color: #24292e;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
        }

        .navbar-title {
          font-weight: 600;
          font-size: 1.25rem;
          cursor: pointer;
        }

        .navbar-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .navbar-links a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          position: relative;
          padding: 0.25rem 0;
          transition: color 0.2s ease;
        }

        /* Underline on hover */
        .navbar-links a::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #58a6ff;
          transition: width 0.3s ease;
        }

        .navbar-links a:hover::after,
        .navbar-links a:focus::after {
          width: 100%;
        }

        .navbar-links a:hover,
        .navbar-links a:focus {
          color: #58a6ff;
          outline: none;
        }

        /* Hamburger button for mobile */
        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
          width: 24px;
          height: 18px;
          justify-content: center;
        }

        .hamburger div {
          height: 3px;
          background: white;
          border-radius: 2px;
          transition: transform 0.3s ease;
        }

        /* Animate hamburger to X when open */
        .hamburger.open div:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.open div:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open div:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        @media (max-width: 600px) {
          .navbar {
            flex-wrap: wrap;
          }

          .hamburger {
            display: flex;
          }

          .navbar-links {
            width: 100%;
            flex-direction: column;
            gap: 1rem;
            margin-top: 0.75rem;
            display: none;
          }

          .navbar-links.mobile-open {
            display: flex;
          }
        }
      `}</style>

      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-title" onClick={() => window.location.href = "/dashboard"}>
          Manage Task
        </div>

        <div
          className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}
          onClick={() => setMobileMenuOpen(false)} // close menu on link click
        >
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/howto">How To</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/settings">Settings</Link>
        </div>

        <button
          className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </button>
      </nav>
    </>
  );
};

export default Navbar;
