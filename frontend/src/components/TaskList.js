import TaskCard from "./TaskCard";

const TaskList = ({ tasks }) => {
  return (
    <div className="space-y-3">
      {tasks.length > 0 ? (
        tasks.map((task) => <TaskCard key={task._id} task={task} />)
      ) : (
        <p className="text-gray-500">No tasks available.</p>
      )}
    </div>
  );
};

export default TaskList;
