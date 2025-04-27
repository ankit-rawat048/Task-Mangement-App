import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; // Import CSS
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentProjects, setRecentProjects] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [username, setUsername] = useState(""); // New state for username
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const createProjects = () => navigate("/createproject");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const data = await response.json();

        // Set the username, recent projects, and completed tasks from API response
        setUsername(data.username);
        setRecentProjects(data.projects); // Assuming 'projects' contains recent projects
        setCompletedTasks(
          data.projects
            .flatMap((project) => project.tasks)
            .filter((task) => task.status === "completed")
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />

      {/* Content */}
      {loading ? (
        <div className="status-message">
          <p className="loading">Loading...</p>
        </div>
      ) : error ? (
        <div className="status-message">
          <p className="error">{error}</p>
        </div>
      ) : (
        <div className="dashboard-content">
          {/* User Info */}
          <section className="user-info">
            <h1>Welcome, {username}!</h1>
            <h2>start your project from here </h2>
            <button onClick={createProjects} className="create-btn">
              + Create Project
            </button>
          </section>

          {/* Recent Projects */}
          <section className="dashboard-section">
            <h2 className="section-title">Recent Projects</h2>
            {Array.isArray(recentProjects) && recentProjects.length > 0 ? (
              <div className="project-grid">
                {recentProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <p className="empty-message">No recent projects found.</p>
            )}
          </section>

          {/* Completed Tasks */}
          <section className="dashboard-section">
            <h2 className="section-title">Recently Completed Tasks</h2>
            {Array.isArray(completedTasks) && completedTasks.length > 0 ? (
              <ul className="task-list">
                {completedTasks.map((task) => (
                  <li key={task._id}>{task.title}</li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">No completed tasks yet.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
