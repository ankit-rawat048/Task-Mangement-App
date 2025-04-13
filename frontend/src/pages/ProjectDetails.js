// src/pages/ProjectDetails.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch project");

        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  if (loading) return <p>Loading project details...</p>;
  if (!project) return <p>Project not found.</p>;

  const formattedDate = project.dueDate
    ? new Date(project.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <div className="project-details-container">
      <h1>{project.title}</h1>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Due Date:</strong> {formattedDate}</p>
      <div>
        <strong>Tasks:</strong>
        <ul>
          {project.tasks?.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
      <p><strong>Tags:</strong> {Array.isArray(project.tags) ? project.tags.join(", ") : project.tags}</p>
    </div>
  );
};

export default ProjectDetails;
