import React from 'react';
import axios from 'axios';

const SubtaskItem = ({ subtask, onUpdate }) => {
  const deleteSubtask = async () => {
    await axios.delete(`/api/tasks/${subtask._id}`);
    onUpdate();
  };

  return (
    <div className="subtask-item">
      <p>{subtask.title} - {subtask.status}</p>
      <button onClick={deleteSubtask}>Delete</button>
    </div>
  );
};

export default SubtaskItem;
