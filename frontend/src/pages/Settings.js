import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import '../styles/csspages/Settings.css'

const Settings = () => {
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
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
          setUserId(data._id);
          setError(""); // clear previous errors on success
        } else {
          setError(data.message || "Failed to fetch user data.");
        }
      } catch (error) {
        setError("Something went wrong while fetching user data.");
        console.error("User Fetch Error:", error);
      }
    };

    fetchUserId();
  }, [navigate, api]);

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (loading) return; // prevent multiple clicks
    setError("");

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
      setLoading(true);
      console.log("🛑 Sending DELETE request for User ID:", userId);

      const response = await fetch(`${api}/api/auth/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      console.log("🔍 Delete API Response:", data);

      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(data.message || "Account deletion failed.");
      }
    } catch (error) {
      console.error("❌ Account Deletion Error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="settings-container">
      <Navbar />
      <h2 className="settings-title">Settings</h2>

      {error && <p className="error-message">{error}</p>}
      <button
        onClick={handleDeleteAccount}
        disabled={loading}
        className="delete-button"
      >
        {loading ? "Deleting..." : "Delete Account"}
      </button>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;
