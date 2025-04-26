import React, { useState } from 'react';

const TaskForm = ({ projectId, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a task.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    const taskData = {
      title,
      description,
      status: 'pending',
      deadline,
      projectId,
      priority,
      tags,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      // Success
      await response.json();
      onTaskCreated(); // ✅ Just trigger refresh

      // Reset form
      setTitle('');
      setDescription('');
      setDeadline('');
      setPriority('');
      setTags([]);
      setError(null);

    } catch (err) {
      setError('Error creating task: ' + err.message);
      console.error('Error creating task:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Create Task</h3>

        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Deadline
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>
          Tags (comma-separated)
          <input
            type="text"
            value={tags.join(', ')}
            onChange={(e) =>
              setTags(
                e.target.value
                  .split(',')
                  .map(tag => tag.trim())
                  .filter(tag => tag !== '')
              )
            }
          />
        </label>

        <button type="submit">Create Task</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TaskForm;
