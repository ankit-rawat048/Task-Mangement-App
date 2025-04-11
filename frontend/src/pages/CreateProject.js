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

  const createNewProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
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
          navigate(`/projectdetails/${data.project._id}`);
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

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a New Project</h1>

      <form onSubmit={createNewProject} className="space-y-4">
        <input
          type="text"
          value={title}
          placeholder="Project Title"
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />

        <textarea
          value={description}
          placeholder="Project Description"
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        ></textarea>

        <input
          type="text"
          value={tags}
          placeholder="Tags (e.g. High Priority)"
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>

      {success && <p className="text-green-600 mt-4">✅ Project created successfully! Redirecting...</p>}
      {error && <p className="text-red-600 mt-4">❌ {error}</p>}
    </div>
  );
};

export default CreateProject;
