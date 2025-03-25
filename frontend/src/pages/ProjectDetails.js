import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.project);
        setTasks(data.tasks);
      })
      .catch((error) => console.error("Error fetching project details:", error));
  }, [id]);

  const addTask = (newTask) => {
    fetch(`http://localhost:5000/api/projects/${id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => setTasks([...tasks, data]))
      .catch((error) => console.error("Error adding task:", error));
  };

  return (
    <div className="p-4">
      {project ? (
        <>
          <h1 className="text-xl font-bold">{project.title}</h1>
          <p className="text-gray-600">{project.description}</p>
          <TaskForm onTaskSubmit={addTask} />
          <TaskList tasks={tasks} />
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectDetails;
