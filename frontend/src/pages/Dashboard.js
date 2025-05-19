import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/csspages/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentProjects, setRecentProjects] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [username, setUsername] = useState(""); // New state for username
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const api = process.env.REACT_APP_API_URL;


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
        const response = await fetch(`${api}/api/user`, {
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
            <div className="intro">
              <h1>Welcome, {username}!</h1>
              <h2>start your project from here </h2>
              <button onClick={createProjects} className="create-btn">
                + Create Project
              </button>
            </div>

            <div className="graph">
              <h2>Project Overview</h2>

              <div className="chart-container">
                <div className="chart-row">
                  <div className="chart-label">Projects</div>
                  <div
                    className="chart-bar"
                    style={{
                      width: `${(recentProjects.length / 50) * 100}%`,
                    }}
                  ></div>
                  <div className="chart-value">{recentProjects.length}</div>
                </div>

                <div className="chart-row">
                  <div className="chart-label">Tasks</div>
                  <div
                    className="chart-bar"
                    style={{
                      width: `${
                        (recentProjects.reduce(
                          (acc, p) => acc + (p.tasks ? p.tasks.length : 0),
                          0
                        ) /
                          50) *
                        100
                      }%`,
                    }}
                  ></div>
                  <div className="chart-value">
                    {recentProjects.reduce(
                      (acc, p) => acc + (p.tasks ? p.tasks.length : 0),
                      0
                    )}
                  </div>
                </div>

                <div className="chart-row">
                  <div className="chart-label">Completed</div>
                  <div
                    className="chart-bar"
                    style={{
                      width: `${(completedTasks.length / 50) * 100}%`,
                    }}
                  ></div>
                  <div className="chart-value">{completedTasks.length}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="recentProNTask">
            {/* Recent Projects */}
            <section className="dashboard-section">
              <h2 className="section-title">Recent Projects</h2>
              {Array.isArray(recentProjects) && recentProjects.length > 0 ? (
                <div className="project-grid">
                  {recentProjects.map((project) => (
                    <div key={project._id} className="project-name">
                      {project.title}
                    </div>
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
                    <li key={task._id}>
                      {task.title} – <em>{task.project.title}</em>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-message">No completed tasks yet.</p>
              )}
            </section>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
