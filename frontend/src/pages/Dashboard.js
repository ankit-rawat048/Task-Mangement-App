import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/csspages/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentProjects, setRecentProjects] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [username, setUsername] = useState("");
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

        if (!response.ok) throw new Error("Failed to fetch dashboard.");

        const data = await response.json();

        setUsername(data.username);
        setRecentProjects(data.projects);

        setCompletedTasks(
          data.projects
            .flatMap((p) => p.tasks)
            .filter((t) => t.status === "completed")
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [api]);

  return (
    <div className="dashboard-container">
      <Navbar />

      {loading ? (
        <p className="status loading">Loading...</p>
      ) : error ? (
        <p className="status error">{error}</p>
      ) : (
        <main className="dashboard-main">

          <header className="dashboard-header">
            <h1>Welcome, {username} 👋</h1>
            <button onClick={createProjects} className="btn-primary">
              + Add New Project
            </button>
          </header>

          {/* Stats */}
          <section className="stats-section">
            <div className="stat-card">
              <p className="stat-number">{recentProjects.length}</p>
              <p className="stat-label">Projects</p>
            </div>

            <div className="stat-card">
              <p className="stat-number">
                {recentProjects.reduce(
                  (acc, p) => acc + (p.tasks ? p.tasks.length : 0),
                  0
                )}
              </p>
              <p className="stat-label">Tasks</p>
            </div>

            <div className="stat-card">
              <p className="stat-number">{completedTasks.length}</p>
              <p className="stat-label">Completed</p>
            </div>
          </section>

          {/* Projects */}
          <section className="content-section">
            <div className="projects-section">
              <h2>Recent Projects</h2>

              {recentProjects.length > 0 ? (
                <div className="project-grid">
                  {recentProjects.map((project) => (
                    <div key={project._id} className="project-card">
                      <h3>{project.title}</h3>
                      <p>
                        {project.description
                          ? project.description.substring(0, 80) + "..."
                          : "No description"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty">No recent projects.</p>
              )}
            </div>

            <div className="tasks-section">
              <h2>Completed Tasks</h2>

              {completedTasks.length > 0 ? (
                <ul className="task-list">
                  {completedTasks.map((task) => (
                    <li key={task._id}>
                      <span>{task.title}</span>
                      <small>{task.project?.title}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty">No completed tasks yet.</p>
              )}
            </div>
          </section>

        </main>
      )}
    </div>
  );
};

export default Dashboard;
