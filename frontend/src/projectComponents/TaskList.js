import React, { useState } from 'react';
import TaskItem from './TaskItem';
import '../projectComponents/StyleOfProject.css';


const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="task-list-container">
      <div className="task-list-items">
        {tasks.map(task => (
          <TaskItem
            key={task._id}
            task={task}
            onTaskUpdated={onTaskUpdated}
            onTaskDeleted={onTaskDeleted}
            onSelect={setSelectedTask}
          />
        ))}
      </div>

      <div className="task-list-details">
        {selectedTask ? (
          <>
            <h3>{selectedTask.title}</h3>
            <p><strong>Description:</strong> {selectedTask.description}</p>
            <p><strong>Deadline:</strong> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong> {selectedTask.status}</p>
            <p><strong>Priority:</strong> {selectedTask.priority}</p>
            <p><strong>Tags:</strong> {(selectedTask.tags || []).join(', ')}</p>
            <p><strong>Notes:</strong> {selectedTask.notes || 'None'}</p>
          </>
        ) : (
          <p>Select a task to view details</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
