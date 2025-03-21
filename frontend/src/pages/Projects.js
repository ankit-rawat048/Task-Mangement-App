import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Global.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="projects-container">
      <h2 className="projects-title">Projects</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div>
          {projects.length === 0 ? (
            <p className="no-projects-message">No projects found.</p>
          ) : (
            <ul className="projects-list">
              {projects.map((project) => (
                <li
                  key={project._id}
                  className="project-item"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  {project.name}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => navigate("/create-project")}
            className="new-project-button"
          >
            + New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;
