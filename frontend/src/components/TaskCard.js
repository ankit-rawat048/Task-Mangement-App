const TaskCard = ({ task }) => {
    return (
      <div className="border p-3 rounded shadow-md bg-gray-50">
        <h3 className="text-md font-semibold">{task.title}</h3>
        <p className="text-sm">{task.description}</p>
        <p className={`mt-1 text-xs ${task.status === "Completed" ? "text-green-600" : "text-red-600"}`}>
          {task.status}
        </p>
      </div>
    );
  };
  
  export default TaskCard;
  