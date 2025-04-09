import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }

        const data = await response.json();
        setProject(data.project);
        setTasks(data.tasks);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, token]);

  const addTask = async (newTask) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const data = await response.json();
      setTasks([...tasks, data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  if (loading) return <p className="p-4">Loading project details...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{project.name}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <TaskForm onTaskSubmit={addTask} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default ProjectDetails;
