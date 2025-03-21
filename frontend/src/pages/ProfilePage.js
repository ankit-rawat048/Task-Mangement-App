import { useState, useEffect } from "react";
import '../styles/Global.css';

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [stats, setStats] = useState({ completedTasks: 0, totalTasks: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userRes = await fetch("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsRes = await fetch("http://localhost:5000/api/user/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok || !statsRes.ok) throw new Error("Failed to fetch data");

        const userData = await userRes.json();
        const statsData = await statsRes.json();

        setUser(userData);
        setStats(statsData);
        setFormData({ name: userData.name, email: userData.email, password: "" });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("User not authenticated!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="profile-card">
          <h2 className="profile-title">Profile</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <label className="form-label">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </label>
            <label className="form-label">
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </label>
            <label className="form-label">
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter new password"
              />
            </label>
            <button type="submit" className="update-button">
              Update Profile
            </button>
          </form>
          <div className="task-stats">
            <h3>Task Stats</h3>
            <p>Completed Tasks: {stats.completedTasks}</p>
            <p>Total Tasks: {stats.totalTasks}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
