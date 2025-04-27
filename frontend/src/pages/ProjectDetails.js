import React, { useEffect, useState } from 'react';
import ProjectHeader from '../projectComponents/ProjectHeader';
import TaskForm from '../projectComponents/TaskForm';
import TaskList from '../projectComponents/TaskList';
import { useParams } from 'react-router-dom';
import '../styles/ProjectDetails.css';

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [error, setError] = useState(null);

  // Trigger re-fetching project
  const refreshProjectDetails = () => setRefreshTrigger(prev => !prev);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch(`http://localhost:5000/api/projects/${projectId}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }

        const data = await response.json();
        setProject(data.project);
        setLoading(false);
      } catch (err) {
        setError('Error fetching project details: ' + err.message);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, refreshTrigger]);

  // Update task
  const handleTaskUpdate = async (updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${updatedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await response.json();
      refreshProjectDetails();
    } catch (err) {
      setError('Error updating task: ' + err.message);
    }
  };

  // Delete task
  const handleTaskDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      refreshProjectDetails();
    } catch (err) {
      setError('Error deleting task: ' + err.message);
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="project-details p-4">
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Project Info */}
      <ProjectHeader project={project} />

      {/* Task Creation */}
      <TaskForm projectId={projectId} onTaskCreated={refreshProjectDetails} />

      {/* Task List */}
      <h3 className="text-2xl font-bold my-4">Tasks</h3>
      <TaskList
        tasks={project.tasks || []}
        onTaskUpdated={handleTaskUpdate}
        onTaskDeleted={handleTaskDelete}
      />
    </div>
  );
};

export default ProjectDetails;
