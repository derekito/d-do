import React, { useState } from 'react';
import './TaskItem.css';

function TaskItem({ task, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(task.id, {
      title: editedTitle,
      dueDate: editedDueDate
    });
    setIsEditing(false);
  };

  return (
    <div className="task-item">
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="task-content">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onEdit(task.id, { completed: !task.completed })}
            />
            <span className={task.completed ? 'completed' : ''}>
              {task.title}
            </span>
            <span className="due-date">{task.dueDate}</span>
          </div>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem; 