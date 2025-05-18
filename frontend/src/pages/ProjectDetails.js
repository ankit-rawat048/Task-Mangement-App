import React, { useEffect, useState } from "react";
import ProjectHeader from "../projectComponents/ProjectHeader";
import TaskForm from "../projectComponents/TaskForm";
import TaskList from "../projectComponents/TaskList";
import { useParams } from "react-router-dom";
import '../styles/csspages/ProjectDetails.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const refreshProjectDetails = () => setRefreshTrigger(prev => !prev);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/projects/${projectId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch project details");
        const data = await response.json();
        setProject(data.project);
      } catch (err) {
        setError("Error fetching project details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, refreshTrigger]);

  const handleTaskUpdate = async (updatedTask) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/tasks/${updatedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error("Failed to update task");

      refreshProjectDetails();
    } catch (err) {
      setError("Error updating task: " + err.message);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete task");

      refreshProjectDetails();
    } catch (err) {
      setError("Error deleting task: " + err.message);
    }
  };

  if (loading) return <div className="loading">Loading project details...</div>;
  if (!project) return <div className="not-found">Project not found.</div>;

  return (
    <div className="project-details">
      {error && <div className="error">{error}</div>}

      <ProjectHeader project={project} projectId={projectId} />


      {/* 🔄 Show project progress visually
      <div className="project-progress">
        <label>Progress: </label>
        <progress value={project.progress || 0} max="100" />
        <span>{Math.round(project.progress || 0)}%</span>
      </div> */}

      <button className="add-task-button" onClick={handleOpenForm}>
        ➕ Add Task
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm
              projectId={projectId}
              onClose={handleCloseForm}
              onTaskCreated={refreshProjectDetails}
            />
          </div>
        </div>
      )}

      <h3 className="task-heading">Tasks</h3>

      <TaskList
        tasks={(project.tasks || []).filter(task => !task.parentTask)}
        projectId={projectId}
        onTaskUpdated={handleTaskUpdate}
        onTaskDeleted={handleTaskDelete}
      />
    </div>
  );
};

export default ProjectDetails;
