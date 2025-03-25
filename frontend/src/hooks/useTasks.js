import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../context/TaskContext";

const useTasks = (projectId) => {
  const { fetchTasks } = useContext(TaskContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId]);

  return { tasks };
};

export default useTasks;
