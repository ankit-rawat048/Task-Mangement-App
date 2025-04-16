import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [subtaskFormVisible, setSubtaskFormVisible] = useState({});
  const [subtaskInputs, setSubtaskInputs] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, token]);

  const handleAddOrUpdateTask = async (e) => {
    e.preventDefault();
    const url = editingTaskId
      ? `http://localhost:5000/api/tasks/${editingTaskId}`
      : `http://localhost:5000/api/tasks/projects/${id}/tasks`;

    const method = editingTaskId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskName,
          deadline: dueDate,
          status: taskStatus,
        }),
      });

      const updatedTask = await response.json();

      setProject((prev) => ({
        ...prev,
        tasks: editingTaskId
          ? prev.tasks.map((t) =>
              t._id === editingTaskId ? updatedTask.task || updatedTask : t
            )
          : [...(prev.tasks || []), updatedTask],
      }));

      setTaskName("");
      setDueDate("");
      setTaskStatus("pending");
      setEditingTaskId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEditTask = (task) => {
    setTaskName(task.title);
    setDueDate(task.deadline?.split("T")[0] || "");
    setTaskStatus(task.status || "pending");
    setEditingTaskId(task._id);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task._id !== taskId),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSubtaskInputChange = (taskId, field, value) => {
    setSubtaskInputs((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value,
      },
    }));
  };

  const handleAddSubtask = async (parentTaskId) => {
    const input = subtaskInputs[parentTaskId];
    if (!input?.title) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: input.title,
          deadline: input.deadline,
          status: input.status || "pending",
          parentTaskId,
          projectId: id,
        }),
      });

      const newSubtask = await response.json();

      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task._id === parentTaskId
            ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
            : task
        ),
      }));

      setSubtaskInputs((prev) => ({ ...prev, [parentTaskId]: {} }));
      setSubtaskFormVisible((prev) => ({ ...prev, [parentTaskId]: false }));
    } catch (error) {
      console.error("Error creating subtask:", error);
    }
  };

  const handleDeleteSubtask = async (subtaskId, parentTaskId) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${subtaskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task._id === parentTaskId
            ? {
                ...task,
                subtasks: task.subtasks.filter((st) => st._id !== subtaskId),
              }
            : task
        ),
      }));
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="project-details-container">
      <h1>{project.title}</h1>
      <p>
        <strong>Description:</strong> {project.description}
      </p>
      <p>
        <strong>Due Date:</strong>{" "}
        {project.dueDate
          ? new Date(project.dueDate).toLocaleDateString()
          : "None"}
      </p>

      <button onClick={() => setShowForm(true)}>Add Task</button>

      <h3>Tasks</h3>
      <ul>
        {project.tasks?.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong> — <em>{task.status}</em>
            {task.deadline && (
              <> — Due: {new Date(task.deadline).toLocaleDateString()}</>
            )}
            <div className="task-actions">
              <button onClick={() => handleEditTask(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              <button
                onClick={() =>
                  setSubtaskFormVisible((prev) => ({
                    ...prev,
                    [task._id]: !prev[task._id],
                  }))
                }
              >
                {subtaskFormVisible[task._id] ? "Cancel" : "Add Subtask"}
              </button>
            </div>
            {subtaskFormVisible[task._id] && (
              <div className="subtask-form">
                <input
                  type="text"
                  placeholder="Subtask name"
                  value={subtaskInputs[task._id]?.title || ""}
                  onChange={(e) =>
                    handleSubtaskInputChange(task._id, "title", e.target.value)
                  }
                />
                <input
                  type="date"
                  value={subtaskInputs[task._id]?.deadline || ""}
                  onChange={(e) =>
                    handleSubtaskInputChange(
                      task._id,
                      "deadline",
                      e.target.value
                    )
                  }
                />
                <select
                  value={subtaskInputs[task._id]?.status || "pending"}
                  onChange={(e) =>
                    handleSubtaskInputChange(task._id, "status", e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={() => handleAddSubtask(task._id)}>
                  Save Subtask
                </button>
              </div>
            )}
            {task.subtasks?.length > 0 && (
              <ul>
                {task.subtasks.map((sub) => (
                  <li key={sub._id}>
                    ↳ {sub.title} — <em>{sub.status}</em>
                    <button
                      onClick={() => handleDeleteSubtask(sub._id, task._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {showForm && (
        <div className="form-popup">
          <form className="form-container" onSubmit={handleAddOrUpdateTask}>
            <h1>{editingTaskId ? "Edit Task" : "Add Task"}</h1>

            <label>
              <b>Task Name</b>
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />

            <label>
              <b>Due Date</b>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />

            <label>
              <b>Status</b>
            </label>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              required
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button type="submit" className="btn">
              {editingTaskId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={() => {
                setShowForm(false);
                setEditingTaskId(null);
                setTaskName("");
                setDueDate("");
                setTaskStatus("pending");
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
