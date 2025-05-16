import React, { useState } from 'react';

const TaskForm = ({ projectId, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return setError('You must be logged in.');

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    const taskData = {
      title,
      description,
      deadline,
      status,
      priority,
      tags,
      projectId,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) throw new Error((await res.json()).message || 'Failed to create task');

      await res.json();
      onTaskCreated();

      // Reset form
      setTitle('');
      setDescription('');
      setDeadline('');
      setStatus('');
      setPriority('');
      setTags([]);
      setError(null);
    } catch (err) {
      setError('Error creating task: ' + err.message);
    }
  };

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit}>
        <h3>Create Task</h3>

        <label>Title
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>

        <label>Description
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </label>

        <label>Deadline
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
        </label>

        <label>Status
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">Select</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>Priority
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>Tags (comma-separated)
          <input value={tags.join(', ')} onChange={e =>
            setTags(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))
          } />
        </label>

        <button type="submit">Create Task</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default TaskForm;
