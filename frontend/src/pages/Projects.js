import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";
import '../styles/Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    } else {
      console.warn("No token found. User might not be logged in.");
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Your Projects</h1>
        <Link to="/projectdeltails/:id" className="create-btn">
          + Create Project
        </Link>
      </div>

      {loading ? (
        <p className="loading-text">Loading projects...</p>
      ) : (
        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          ) : (
            <p className="no-projects">No projects found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
