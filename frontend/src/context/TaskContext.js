import { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const fetchTasks = (projectId) => {
    fetch(`http://localhost:5000/api/projects/${projectId}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  return (
    <TaskContext.Provider value={{ projects, tasks, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
