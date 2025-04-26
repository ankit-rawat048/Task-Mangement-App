import React, { useState } from "react";

const ProjectSettingsMenu = ({ project, onUpdate, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/projects/${project._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();
      onUpdate(data.project);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/projects/${project._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      onDelete(project._id);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        style={{ cursor: "pointer", fontSize: "20px" }}
        onClick={() => setMenuOpen(!menuOpen)}
      >settings</button>

      {menuOpen && (
        <div style={styles.menu}>
          <button onClick={() => { setShowEditModal(true); setMenuOpen(false); }}>Edit Project</button>
          <button onClick={() => { setShowDeleteConfirm(true); setMenuOpen(false); }}>Delete Project</button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit Project</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Title"
              style={styles.input}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project Description"
              style={styles.textarea}
            />
            <div style={styles.actions}>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Are you sure?</h3>
            <p>This will permanently delete the project.</p>
            <div style={styles.actions}>
              <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  menu: {
    position: "absolute",
    top: "24px",
    right: 0,
    background: "#fff",
    border: "1px solid #ccc",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    padding: "8px",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "6px",
    width: "300px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
  },
  input: {
    width: "100%",
    marginBottom: "10px",
    padding: "8px"
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "8px",
    marginBottom: "10px"
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px"
  }
};

export default ProjectSettingsMenu;
