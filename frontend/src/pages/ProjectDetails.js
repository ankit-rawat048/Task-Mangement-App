import React, { useEffect, useState, useCallback } from "react";
import ProjectHeader from "../projectComponents/ProjectHeader";
import TaskForm from "../projectComponents/TaskForm";
import TaskList from "../projectComponents/TaskList";
import { useParams } from "react-router-dom";
import "../styles/csspages/ProjectDetails.css";

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // for update/delete actions

  const api = process.env.REACT_APP_API_URL;

  const clearErrorAfterTimeout = useCallback(() => {
    setTimeout(() => setError(null), 5000);
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${api}/api/projects/${projectId}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch project details");
        const data = await response.json();
        setProject(data.project);
      } catch (err) {
        setError("Error fetching project details: " + err.message);
        clearErrorAfterTimeout();
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, refreshTrigger, api, clearErrorAfterTimeout]);

  const refreshProjectDetails = () => setRefreshTrigger((prev) => !prev);

  const handleTaskUpdate = async (updatedTask) => {
    if (actionLoading) return;
    setError(null);
    setActionLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${api}/api/tasks/${updatedTask._id}`, {
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
      clearErrorAfterTimeout();
    } finally {
      setActionLoading(false);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (actionLoading) return;
    setError(null);
    setActionLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${api}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete task");

      refreshProjectDetails();
    } catch (err) {
      setError("Error deleting task: " + err.message);
      clearErrorAfterTimeout();
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  if (loading) return <div className="loading">Loading project details...</div>;
  if (!project) return <div className="not-found">Project not found.</div>;

  return (
    <div className="project-details">
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <ProjectHeader project={project} projectId={projectId} />

      {/* Uncomment below to enable visual progress bar */}
      {/* <div className="project-progress">
        <label htmlFor="progressBar">Progress: </label>
        <progress id="progressBar" value={project.progress || 0} max="100" />
        <span>{Math.round(project.progress || 0)}%</span>
      </div> */}

      <button
        className="add-task-button"
        onClick={handleOpenForm}
        disabled={actionLoading}
        aria-disabled={actionLoading}
      >
        ➕ Add Task
      </button>

      {showForm && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={handleCloseForm}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              projectId={projectId}
              onClose={handleCloseForm}
              onTaskCreated={() => {
                refreshProjectDetails();
                handleCloseForm();
              }}
              disabled={actionLoading}
            />
          </div>
        </div>
      )}

      <div className="task-heading">
        <TaskList
          tasks={(project.tasks || []).filter((task) => !task.parentTask)}
          projectId={projectId}
          onTaskUpdated={handleTaskUpdate}
          onTaskDeleted={handleTaskDelete}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
