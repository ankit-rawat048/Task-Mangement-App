import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Global.css";

const TasksPage = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks?projectId=${projectId}`);
        if (!response.ok) throw new Error("Failed to fetch tasks.");
        const data = await response.json();
        setTasks(data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))); // Sort by deadline
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="tasks-container">
      <h2 className="tasks-title">Tasks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className={`task-item ${task.completed ? "completed-task" : ""}`}>
              <span className={`task-name priority-${task.priority.toLowerCase()}`}>
                {task.name} (Priority: {task.priority}) - Due: {new Date(task.deadline).toLocaleDateString()}
              </span>
              <div className="task-buttons">
                <button onClick={() => toggleTaskCompletion(task._id, task.completed)} className="complete-btn">
                  {task.completed ? "Mark Pending" : "Mark Complete"}
                </button>
                <button onClick={() => navigate(`/tasks/${task._id}/edit`)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => deleteTask(task._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate(`/projects/${projectId}/create-task`)} className="new-task-btn">
        + New Task
      </button>
    </div>
  );
};

export default TasksPage;
