import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const createNewProject = async (e) => {
    e.preventDefault();

    // Get the token from localStorage (or another secure place)
    const token = localStorage.getItem("token");

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 👈 Add token here
        },
        body: JSON.stringify({ name, description })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Project created:", data);
        setSuccess(true);

        setName('');
        setDescription('');

        setTimeout(() => {
          navigate('/projectdetails');
        }, 1500);
      } else {
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div>
      <h1>Create a New Project</h1>
      <form onSubmit={createNewProject}>
        <input
          type="text"
          value={name}
          placeholder="Enter your project name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <button type="submit">Create Project</button>
      </form>

      {success && (
        <p style={{ color: "green", marginTop: "10px" }}>
          ✅ Project created successfully! Redirecting...
        </p>
      )}
    </div>
  );
};

export default CreateProject;
