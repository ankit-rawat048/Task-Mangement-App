import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Global.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const projectRes = await fetch("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const taskRes = await fetch("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (projectRes.status === 401 || taskRes.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
          return;
        }

        const projectData = await projectRes.json();
        const taskData = await taskRes.json();

        setProjects(projectData);
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Dashboard</h2>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Total Projects</h3>
              <p>{projects.length}</p>
            </div>
            <div className="dashboard-card">
              <h3>Completed Tasks</h3>
              <p>{completedTasks}</p>
            </div>
            <div className="dashboard-card">
              <h3>Pending Tasks</h3>
              <p>{pendingTasks}</p>
            </div>
          </div>
          <button onClick={() => navigate("/create-project")} className="dashboard-button project-button">
            + New Project
          </button>
          <button onClick={() => navigate("/create-task")} className="dashboard-button task-button">
            + New Task
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
