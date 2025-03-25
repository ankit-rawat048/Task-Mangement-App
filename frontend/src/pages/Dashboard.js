import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length > 0 ? (
          projects.map((project) => <ProjectCard key={project._id} project={project} />)
        ) : (
          <p>No projects found. Start by creating a new project!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
