import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentProjects, setRecentProjects] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const createProjects = () => navigate('/createproject');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/all-data", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const data = await response.json();
        setRecentProjects(data.recentProjects);
        setCompletedTasks(data.completedTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="flex gap-4 mb-4">
        <Link to="/settings">Settings</Link>
        <Link to="/projects">Projects</Link>
        <button onClick={createProjects}>Create New Project</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Recent Projects</h2>
            {recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <p>No recent projects.</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Recently Completed Tasks</h2>
            {completedTasks.length > 0 ? (
              <ul className="list-disc list-inside">
                {completedTasks.map((task) => (
                  <li key={task._id}>{task.title}</li>
                ))}
              </ul>
            ) : (
              <p>No completed tasks.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
