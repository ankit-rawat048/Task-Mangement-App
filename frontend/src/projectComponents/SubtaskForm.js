import React, { useState } from "react";

const SubtaskForm = ({ parentTaskId, projectId, onSubtaskAdded, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `http://localhost:5000/api/tasks/projects/${projectId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            status,
            priority,
            deadline,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            notes,
            parentTask: parentTaskId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add subtask");

      const newSubtask = await response.json();
      setTitle("");
      setDescription("");
      setStatus("pending");
      setPriority("medium");
      setDeadline("");
      setTags("");
      setNotes("");
      setError(null);
      onSubtaskAdded?.(newSubtask);
    } catch (err) {
      console.error("Error adding subtask:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="subtask-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Subtask title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Subtask description"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Comma-separated tags (e.g., frontend, urgent)"
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />

      <div className="button-group">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Subtask"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default SubtaskForm;
