const calculateProgress = (tasks) => {
  let totalTasks = 0;
  let completedTasks = 0;

  tasks.forEach(task => {
    totalTasks += 1;
    if (task.completed) completedTasks += 1;

    task.subtasks?.forEach(subtask => {
      totalTasks += 1;
      if (subtask.completed) completedTasks += 1;
    });
  });

  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};

module.exports = calculateProgress;
