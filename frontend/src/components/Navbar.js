import { Link } from "react-router-dom";
import { useState } from "react";
import '../styles/components/Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    

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
  );
};

export default Navbar;
