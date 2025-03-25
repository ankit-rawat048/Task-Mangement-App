import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Projects</h1>
      <Link to="/projects/new" className="bg-blue-500 text-white px-4 py-2 rounded">+ Create New Project</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {projects.length > 0 ? (
          projects.map((project) => <ProjectCard key={project._id} project={project} />)
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
