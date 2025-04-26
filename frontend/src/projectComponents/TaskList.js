import React, { useState } from 'react';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [notes, setNotes] = useState(task.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [error, setError] = useState(null);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskDescription, setSubtaskDescription] = useState('');
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskError, setSubtaskError] = useState(null);

  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}/notes`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      setIsEditingNotes(false);
    } catch (err) {
      console.error('Failed to save notes:', err);
      setError('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleAddSubtask = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: subtaskTitle,
          description: subtaskDescription,
          parentTaskId: task._id,  // Reference the parent task
          projectId: task.projectId,

        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add subtask');
      }
  
      const subtask = await response.json();
      setSubtaskTitle('');
      setSubtaskDescription('');
      setShowSubtaskForm(false);
      setSubtaskError(null);
  
      // Update parent task with new subtask
      task.subtasks.push(subtask._id);  // Add subtask ObjectId to parent task
      onTaskUpdated(task);
    } catch (err) {
      console.error('Error while adding subtask:', err);
      setSubtaskError('Failed to add subtask');
    }
  };
  

  return (
    <div className="task-item border p-4 rounded shadow mb-4 bg-white">
      <h4 className="text-lg font-semibold">{task.title}</h4>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Due Date:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Tags:</strong> {task.tags.join(', ')}</p>
      <p><strong>Progress:</strong> {task.progress}%</p>

      {/* Notes section */}
      <div className="mt-2">
        <strong>Notes:</strong>
        {isEditingNotes ? (
          <div>
            <textarea
              className="w-full mt-1 p-2 border rounded"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <div className="mt-2 flex gap-2">
              <button onClick={handleSaveNotes} disabled={isSavingNotes} className="bg-blue-600 text-white px-3 py-1 rounded">
                {isSavingNotes ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => {
                setNotes(task.notes || '');
                setIsEditingNotes(false);
              }} className="bg-gray-300 px-3 py-1 rounded">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-2 rounded mt-1 whitespace-pre-line text-sm">
            {notes || 'No notes'}
            <button onClick={() => setIsEditingNotes(true)} className="block text-blue-600 mt-2 text-xs hover:underline">
              Edit Notes
            </button>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-3 flex gap-3">
        <button onClick={() => onTaskUpdated(task)} className="bg-yellow-500 text-white px-3 py-1 rounded">
          Update Task
        </button>
        <button onClick={() => onTaskDeleted(task._id)} className="bg-red-600 text-white px-3 py-1 rounded">
          Delete Task
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {subtaskError && <p className="text-red-600 mt-2">{subtaskError}</p>}

      {/* Add Subtask */}
      <div className="mt-4">
        {!showSubtaskForm ? (
          <button onClick={() => setShowSubtaskForm(true)} className="text-blue-600 text-sm hover:underline">
            ➕ Add Subtask
          </button>
        ) : (
          <div className="mt-2 p-2 border rounded bg-gray-50">
            <input
              className="w-full p-2 mb-2 border rounded"
              type="text"
              placeholder="Subtask title"
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
            />
            <textarea
              className="w-full p-2 mb-2 border rounded"
              placeholder="Subtask description (optional)"
              value={subtaskDescription}
              onChange={(e) => setSubtaskDescription(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2">
              <button onClick={handleAddSubtask} className="bg-green-600 text-white px-3 py-1 rounded">
                Save Subtask
              </button>
              <button
                onClick={() => setShowSubtaskForm(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render Subtasks recursively */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="ml-6 mt-4 border-l-2 border-gray-300 pl-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">Subtasks:</p>
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask._id}
              task={subtask}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
};

export default TaskList;
