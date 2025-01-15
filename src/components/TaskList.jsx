import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('date');

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTasks(items);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const editTask = (taskId, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  const sortTasks = () => {
    const sortedTasks = [...tasks];
    if (sortBy === 'date') {
      return sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
  };

  return (
    <div className="task-list">
      <div className="task-controls">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sortTasks().map((task, index) => (
                <Draggable 
                  key={task.id} 
                  draggableId={task.id.toString()} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskItem
                        task={task}
                        onDelete={deleteTask}
                        onEdit={editTask}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default TaskList; 