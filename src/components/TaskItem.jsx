import React from 'react';

function TaskItem({ task, onDelete, onEdit }) {
  return (
    <div className="task-item">
      <span>{task.title}</span>
      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}

export default TaskItem; 