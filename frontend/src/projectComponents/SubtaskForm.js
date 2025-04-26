import React, { useState } from 'react';
import axios from 'axios';

const SubtaskForm = ({ parentTaskId, projectId, onSuccess }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/tasks', {
      title,
      status: 'pending',
      projectId,
      parentTaskId
    });
    setTitle('');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="subtask-form">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Subtask title" required />
      <button type="submit">Add Subtask</button>
    </form>
  );
};

export default SubtaskForm;
