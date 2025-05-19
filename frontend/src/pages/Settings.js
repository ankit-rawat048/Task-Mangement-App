import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Settings = () => {
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const api = process.env.REACT_APP_API_URL;

  // Fetch user data to get userId
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login"); // Redirect if no token

        const response = await fetch(`${api}/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUserId(data._id); // ✅ Ensure correct property
        } else {
          setError(data.message || "Failed to fetch user data.");
        }
      } catch (error) {
        setError("Something went wrong while fetching user data.");
        console.error("User Fetch Error:", error);
      }
    };

    fetchUserId();
  }, [navigate]);

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please log in again.");
      return navigate("/login");
    }

    if (!userId) {
      setError("User ID not found. Please try again.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      return;
    }

    try {
      console.log("🛑 Sending DELETE request for User ID:", userId);

      const response = await fetch(`${api}/api/auth/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }), // ✅ Send as JSON object
      });

      const data = await response.json();
      console.log("🔍 Delete API Response:", data);

      if (response.ok) {
        localStorage.removeItem("token"); // ✅ Clear token
        navigate("/login"); // ✅ Redirect to login
      } else {
        setError(data.message || "Account deletion failed.");
      }
    } catch (error) {
      console.error("❌ Account Deletion Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove token
    navigate("/login"); // ✅ Redirect to login
  };

  return (
    <div className="settings-container">
      <Navbar />
      <h2>Settings</h2>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleDeleteAccount} className="delete-button">
        Delete Account
      </button>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Settings;
