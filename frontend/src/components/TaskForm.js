import { useState } from "react";

const TaskForm = ({ onTaskSubmit }) => {
  const [task, setTask] = useState({ title: "", description: "", status: "Pending" });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onTaskSubmit(task);
    setTask({ title: "", description: "", status: "Pending" });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-50">
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={task.title}
        onChange={handleChange}
        required
        className="border p-2 w-full mb-2"
      />
      <textarea
        name="description"
        placeholder="Task Description"
        value={task.description}
        onChange={handleChange}
        required
        className="border p-2 w-full mb-2"
      ></textarea>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
    </form>
  );
};

export default TaskForm;
