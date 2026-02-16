import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/csspages/Dashboard.css";
import bgvideo from "../images/4990239-hd_1920_1080_30fps.mp4";

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

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const data = await response.json();

        setUsername(data.username);
        setRecentProjects(data.projects);
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
  }, [api]);

  return (
    
    <div className="dashboard-container">
      <video autoPlay loop muted playsInline className="video-bg">
        <source src={bgvideo} type="video/mp4" />
      </video>

      <Navbar />

      {loading ? (
        <div className="status-message">
          <p className="loading">Loading...</p>
        </div>
      ) : error ? (
        <div className="status-message">
          <p className="error">{error}</p>
        </div>
      ) : (
        <main className="dashboard-main">
          <header className="dashboard-header">
            <h1>Welcome, {username}!</h1>
            <button onClick={createProjects} className="btn-primary">
              + New Project
            </button>
          </header>

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
              <p className="stat-label">Completed Tasks</p>
            </div>
          </section>

          <section className="content-section">
            <div className="projects-section">
              <h2>Recent Projects</h2>
              {recentProjects.length > 0 ? (
                <div className="project-grid">
                  {recentProjects.map((project) => (
                    <div key={project._id} className="project-card">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-desc">
                        {project.description
                          ? project.description.substring(0, 80) + "..."
                          : "No description"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">No recent projects found.</p>
              )}
            </div>

            <div className="tasks-section">
              <h2>Recently Completed Tasks</h2>
              {completedTasks.length > 0 ? (
                <ul className="task-list">
                  {completedTasks.map((task) => (
                    <li key={task._id} className="task-item">
                      <p className="task-title">{task.title}</p>
                      <p className="task-project">{task.project?.title}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-message">No completed tasks yet.</p>
              )}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default Dashboard;
