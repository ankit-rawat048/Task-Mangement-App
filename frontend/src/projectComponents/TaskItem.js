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
  const [showButtons, setShowButtons] = useState(false); // Toggle for action buttons

  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const res = await fetch(`http://localhost:5000/api/tasks/${task._id}/notes`, {
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

      const res = await fetch(`http://localhost:5000/api/tasks/projects/${projectId}/tasks`, {
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

  return (
    <div className="task-item-container">
      <div className="task-item-header">
        <button onClick={() => setIsExpanded(!isExpanded)} aria-label="Toggle expand" style={{width:"10%"}}>
          {isExpanded ? "▼" : "▶"} 
        </button>
        <strong onClick={() => onSelect(task)} style={{width:"80%"}}>{task.title}</strong>

        <div className="dropdownButton" style={{width:"10%"}}>
          <button onClick={() => setShowButtons(!showButtons)}>⋮</button>
          {showButtons && (
            <div className="task-item-button-group">
              {!isEditingNotes && (
                <button onClick={() => setIsEditingNotes(true)} className="task-item-button">
                  📝 Edit Notes
                </button>
              )}
              {!showSubtaskForm && (
                <button onClick={() => setShowSubtaskForm(true)} className="task-item-button">
                  ➕ Add Subtask
                </button>
              )}
              <button onClick={() => onTaskDeleted(task._id)} className="task-item-button">
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {isEditingNotes && (
            <div className="task-item-notes">
              <textarea
                className="task-item-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <div className="task-item-button-group">
                <button
                  className="task-item-button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                >
                  {isSavingNotes ? "Saving..." : "💾 Save Notes"}
                </button>
                <button className="task-item-button" onClick={() => setIsEditingNotes(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {error && <p className="task-item-error">{error}</p>}

          {showSubtaskForm && (
            <div className="task-item-subtask-form">
              <input
                className="task-item-subtask-input"
                placeholder="Subtask title"
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
              />
              <textarea
                className="task-item-subtask-textarea"
                placeholder="Subtask description"
                value={subtaskDescription}
                onChange={(e) => setSubtaskDescription(e.target.value)}
              />
              <div className="task-item-button-group">
                <button className="task-item-button" onClick={handleAddSubtask}>
                  Add
                </button>
                <button className="task-item-button" onClick={() => setShowSubtaskForm(false)}>
                  Cancel
                </button>
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
