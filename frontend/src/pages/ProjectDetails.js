import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/Global.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const [projectRes, taskRes] = await Promise.all([
          fetch(`http://localhost:5000/api/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/tasks?projectId=${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!projectRes.ok || !taskRes.ok) throw new Error("Failed to fetch project details");

        const projectData = await projectRes.json();
        const taskData = await taskRes.json();

        setProject(projectData);
        setTasks(taskData);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projectId]);

  return (
    <div className="project-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : project ? (
        <div>
          <h2 className="project-title">{project.name}</h2>
          <p className="project-description">{project.description}</p>
          <h3 className="task-heading">Tasks</h3>
          {tasks.length === 0 ? (
            <p className="no-tasks-message">No tasks added yet.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className={`task-item ${task.completed ? "completed" : "pending"}`}>
                  {task.name} - {task.completed ? "✅ Completed" : "⏳ Pending"}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => navigate(`/projects/${projectId}/create-task`)}
            className="new-task-button"
          >
            + New Task
          </button>
        </div>
      ) : (
        <p className="not-found-message">Project not found.</p>
      )}
    </div>
  );
};

export default ProjectDetails;
