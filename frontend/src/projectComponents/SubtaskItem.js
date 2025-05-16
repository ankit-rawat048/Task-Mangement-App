import React from 'react';

const SubtaskItem = ({ subtask, onUpdate }) => {
  const deleteSubtask = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/tasks/${subtask._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete subtask');
      }

      onUpdate();
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  return (
    <div className="subtask-item">
      <p>{subtask.title} - {subtask.status}</p>
      <button onClick={deleteSubtask}>Delete</button>
    </div>
  );
};

export default SubtaskItem;
