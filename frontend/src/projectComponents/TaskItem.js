import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../projectComponents/StyleOfProject.css";

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted, onSelect }) => {
  const { id: projectId } = useParams();

  const [notes, setNotes] = useState(task.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [error, setError] = useState(null);

  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskDescription, setSubtaskDescription] = useState("");
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  const [isExpanded, setIsExpanded] = useState(true);
  const [showButtons, setShowButtons] = useState(false);

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editDueDate, setEditDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10) : "");
  const [editStatus, setEditStatus] = useState(task.status || "pending");
  const [isSavingTask, setIsSavingTask] = useState(false);

    const api = process.env.REACT_APP_API_URL;


  const handleSaveTask = async () => {
    try {
      setIsSavingTask(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const res = await fetch(`${api}/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          dueDate: editDueDate || null,
          status: editStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      const updatedTask = await res.json();
      onTaskUpdated(updatedTask);
      setIsEditingTask(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const res = await fetch(`${api}/api/tasks/${task._id}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });

      if (!res.ok) throw new Error("Failed to save notes");
      setIsEditingNotes(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleAddSubtask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const res = await fetch(`${api}/api/tasks/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: subtaskTitle,
          description: subtaskDescription,
          parentTask: task._id,
        }),
      });

      if (!res.ok) throw new Error("Failed to create subtask");
      const newSubtask = await res.json();

      onTaskUpdated({
        ...task,
        subtasks: [...(task.subtasks || []), newSubtask],
      });

      setSubtaskTitle("");
      setSubtaskDescription("");
      setShowSubtaskForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteTask = async () => {
    if (!task || !task._id) {
      setError("Task ID is missing or invalid.");
      return;
    }

    const incompleteSubtasks = (task.subtasks || []).some(
      (sub) => sub.status !== "completed"
    );

    if (incompleteSubtasks) {
      setError("All subtasks must be completed before completing this task.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const res = await fetch(`${api}/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!res.ok) throw new Error("Failed to mark task as completed");

      const updated = await res.json();
      onTaskUpdated(updated);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="task-item-container">
      <div className="task-item-header">
        <button onClick={() => setIsExpanded(!isExpanded)} style={{ width: "10%" }}>
          {isExpanded ? "▼" : "▶"}
        </button>

        {!isEditingTask ? (
          <strong
            onClick={() => onSelect(task)}
            style={{ width: "80%", display: "flex", alignItems: "center", gap: "6px" }}
          >
            {task.title}
            {task.status === "completed" && (
              <span role="img" aria-label="Completed" style={{ color: "green" }}>✅</span>
            )}
          </strong>
        ) : (
          <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: "4px" }}>
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        {!isEditingTask && task.status !== "completed" && (
          <button onClick={handleCompleteTask} className="task-item-button">✅ Completed</button>
        )}

        <div className="dropdownButton" style={{ width: "10%" }}>
          <button onClick={() => setShowButtons(!showButtons)}>⋮</button>
          {showButtons && (
            <div className="task-item-button-group">
              {!isEditingNotes && !isEditingTask && (
                <>
                  <button onClick={() => setIsEditingNotes(true)}>📝 Edit Notes</button>
                  <button onClick={() => setShowSubtaskForm(true)}>➕ Add Subtask</button>
                  <button onClick={() => setIsEditingTask(true)}>✏️ Edit Task</button>
                </>
              )}
              {isEditingTask && (
                <>
                  <button onClick={handleSaveTask} disabled={isSavingTask}>
                    {isSavingTask ? "Saving..." : "💾 Save Task"}
                  </button>
                  <button onClick={() => setIsEditingTask(false)} disabled={isSavingTask}>
                    Cancel
                  </button>
                </>
              )}
              <button onClick={() => onTaskDeleted(task._id)}>🗑️ Delete</button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {isEditingNotes && (
            <div className="task-item-notes">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              <div className="task-item-button-group">
                <button onClick={handleSaveNotes} disabled={isSavingNotes}>
                  {isSavingNotes ? "Saving..." : "💾 Save Notes"}
                </button>
                <button onClick={() => setIsEditingNotes(false)}>Cancel</button>
              </div>
            </div>
          )}

          {error && <p className="task-item-error">{error}</p>}

          {showSubtaskForm && (
            <div className="task-item-subtask-form">
              <input
                placeholder="Subtask title"
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
              />
              <textarea
                placeholder="Subtask description"
                value={subtaskDescription}
                onChange={(e) => setSubtaskDescription(e.target.value)}
              />
              <div className="task-item-button-group">
                <button onClick={handleAddSubtask}>Add</button>
                <button onClick={() => setShowSubtaskForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {task.subtasks?.length > 0 && (
            <div className="task-item-subtasks">
              {task.subtasks.map((subtask) => (
                <TaskItem
                  key={subtask._id}
                  task={subtask}
                  onTaskUpdated={onTaskUpdated}
                  onTaskDeleted={onTaskDeleted}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskItem;
