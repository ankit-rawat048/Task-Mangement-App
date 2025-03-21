import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Global.css";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem("notifications")) || true);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleNotifications = () => setNotifications((prev) => !prev);

  const deleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        return navigate("/login");
      }

      try {
        const response = await fetch("http://localhost:5000/api/user/delete", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to delete account.");

        alert("Account deleted successfully.");
        localStorage.clear();
        navigate("/signup");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">Settings</h2>

        <div className="settings-option">
          <span className="settings-label">Dark Mode</span>
          <button onClick={toggleDarkMode} className="settings-button">
            {darkMode ? "Disable" : "Enable"}
          </button>
        </div>

        <div className="settings-option">
          <span className="settings-label">Notifications</span>
          <button onClick={toggleNotifications} className="settings-button">
            {notifications ? "Disable" : "Enable"}
          </button>
        </div>

        <button onClick={deleteAccount} className="delete-button">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
