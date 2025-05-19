import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const api = process.env.REACT_APP_API_URL;


  const createNewProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${api}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, tags, dueDate })
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        console.log("Project created:", data);
        setSuccess(true);
        setTitle('');
        setDescription('');
        setTags('');
        setDueDate('');

        setTimeout(() => {
          navigate(`/projects`);
        }, 1000);
      } else {
        const errData = await response.json();
        setError(errData.message || "Failed to create project.");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      console.error("Error creating project:", err);
    }
  };

  const styles = {
    container: {
      padding: "24px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      margin: "0 auto"
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "24px",
      textAlign: "center",
      color: "#333"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "16px",
      transition: "border-color 0.3s ease"
    },
    inputFocus: {
      borderColor: "#007bff",
      outline: "none"
    },
    button: {
      padding: "12px",
      backgroundColor: "#007bff",
      color: "white",
      fontSize: "16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.3s ease"
    },
    buttonHover: {
      backgroundColor: "#0056b3"
    },
    buttonDisabled: {
      backgroundColor: "#cccccc",
      cursor: "not-allowed"
    },
    successMessage: {
      color: "#28a745",
      fontSize: "16px",
      textAlign: "center",
      marginTop: "16px"
    },
    errorMessage: {
      color: "#dc3545",
      fontSize: "16px",
      textAlign: "center",
      marginTop: "16px"
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create a New Project</h1>

      <form onSubmit={createNewProject} style={styles.form}>
        <input
          type="text"
          value={title}
          placeholder="Project Title"
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <textarea
          value={description}
          placeholder="Project Description"
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.input}
        ></textarea>

        <input
          type="text"
          value={tags}
          placeholder="Tags (e.g. High Priority)"
          onChange={(e) => setTags(e.target.value)}
          style={styles.input}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
        />

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
            ...(loading ? {} : styles.buttonHover)
          }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>

      {success && <p style={styles.successMessage}>✅ Project created successfully! Redirecting...</p>}
      {error && <p style={styles.errorMessage}>❌ {error}</p>}
    </div>
  );
};

export default CreateProject;
