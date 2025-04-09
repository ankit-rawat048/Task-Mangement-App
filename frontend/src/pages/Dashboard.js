import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();


  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const createProjects = () =>{
    navigate('/createproject');
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token"); // ✅ Retrieve JWT token from localStorage

      if (!token) {
        setError("Unauthorized: Please log in to access projects.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Send the token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects: " + response.statusText);
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <h1><Link to={'/settings'}>settings</Link></h1>
      <h1><Link to={'/projects'}>projects</Link></h1>
      <button onClick={createProjects}>create new project</button>

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <p>No projects found. Start by creating a new project!</p>

      )}
    </div>
  );
};

export default Dashboard;
