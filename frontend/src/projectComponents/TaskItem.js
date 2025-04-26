import React, { useState } from 'react';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState(task.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskDescription, setSubtaskDescription] = useState('');
  const [subtaskError, setSubtaskError] = useState(null);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  const handleDeleteClick = () => setIsDeleteConfirmVisible(true);

  const handleConfirmDelete = async () => {
    try {
      await onTaskDeleted(task._id);
      setIsDeleteConfirmVisible(false);
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
    }
  };

  const handleCancelDelete = () => setIsDeleteConfirmVisible(false);

  const handleUpdateClick = () => {
    const updatedTask = {
      ...task,
      title: 'Updated Task Title',
      description: 'Updated task description',
      status: 'In Progress',
      priority: 'Medium',
      tags: ['updated'],
    };
    onTaskUpdated(updatedTask);
  };

  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error('Failed to update notes');
      setIsEditingNotes(false);
    } catch (err) {
      console.error('Failed to update notes:', err);
      setError('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!subtaskTitle.trim()) {
      setSubtaskError('Subtask title cannot be empty');
      return;
    }

    if (!task.projectId) {
      setSubtaskError('Missing project ID for this task.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: subtaskTitle,
          description: subtaskDescription,
          parentTaskId: task._id,
          projectId: task.projectId, // ✅ projectId is mandatory now
        }),
      });

      if (!res.ok) throw new Error('Failed to create subtask');

      setSubtaskTitle('');
      setSubtaskDescription('');
      setShowSubtaskForm(false);
      setSubtaskError(null);

      onTaskUpdated(task); // refresh task data
    } catch (err) {
      console.error(err);
      setSubtaskError('Failed to add subtask');
    }
  };

  const renderSubtasks = () => {
    if (!task.subtasks || task.subtasks.length === 0) return null;

    return (
      <div className="ml-6 mt-4 border-l-2 border-gray-300 pl-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">Subtasks:</p>
        {task.subtasks.map((subtask) => (
          <TaskItem
            key={subtask._id}
            task={{ ...subtask, projectId: task.projectId }} // ✅ inherit projectId for nested subtasks
            onTaskUpdated={onTaskUpdated}
            onTaskDeleted={onTaskDeleted}
          />
        ))}
      </div>
    );
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

      {/* Notes */}
      <div className="mt-3">
        <label className="font-semibold">Notes:</label>
        {isEditingNotes ? (
          <>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full mt-1 p-2 border rounded"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSaveNotes}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                disabled={isSavingNotes}
              >
                {isSavingNotes ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setNotes(task.notes || '');
                  setIsEditingNotes(false);
                }}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="bg-gray-100 p-2 rounded mt-1 whitespace-pre-line text-sm">
            {notes || 'No notes yet.'}
            <button
              onClick={() => setIsEditingNotes(true)}
              className="block text-blue-600 mt-2 text-xs hover:underline"
            >
              Edit Notes
            </button>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-3">
        <button onClick={handleUpdateClick} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
          Update Task
        </button>
        <button onClick={handleDeleteClick} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
          Delete Task
        </button>
      </div>

      {/* Delete confirmation */}
      {isDeleteConfirmVisible && (
        <div className="mt-3 bg-red-100 border border-red-300 p-3 rounded">
          <p>Are you sure you want to delete this task?</p>
          <div className="mt-2 flex gap-2">
            <button onClick={handleConfirmDelete} className="bg-red-600 text-white px-3 py-1 rounded">
              Yes, Delete
            </button>
            <button onClick={handleCancelDelete} className="bg-gray-300 px-3 py-1 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-600 mt-2">{error}</p>}

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
            {subtaskError && <p className="text-red-600 text-sm">{subtaskError}</p>}
            <div className="flex gap-2">
              <button onClick={handleAddSubtask} className="bg-green-600 text-white px-3 py-1 rounded">
                Save Subtask
              </button>
              <button
                onClick={() => {
                  setShowSubtaskForm(false);
                  setSubtaskError(null);
                }}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render nested subtasks */}
      {renderSubtasks()}
    </div>
  );
};

export default TaskItem;
