import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';
import { NotificationPermission } from './components/NotificationPermission';
import { PomodoroTimer } from './components/PomodoroTimer';

const quotes = [
  "Small habits can have a surprising impact.",
  "Every action you take is a vote for who you want to become.",
  "Success is the product of daily habits.",
  "Focus on the system, not the goal.",
  "The quality of your life depends on the quality of your habits.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Time magnifies the margin between success and failure.",
  "Habits are the compound interest of self-improvement.",
  "You should be far more concerned with your current trajectory than with your current results.",
  "The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become."
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem('notes') || '';
    } catch (error) {
      console.log('Storage access error:', error);
      return '';
    }
  });

  const quote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return `${quotes[randomIndex]} ~ Atomic Habits`;
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      title: newTask,
      dueDate: dueDate,
      dueTime: dueTime,
      completed: false
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setDueDate('');
    setDueTime('');
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const sortTasks = (tasksToSort) => {
    return tasksToSort.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'time':
          // Create full date-time objects for comparison
          const dateTimeA = new Date(`${a.dueDate}T${a.dueTime || '23:59'}`);
          const dateTimeB = new Date(`${b.dueDate}T${b.dueTime || '23:59'}`);
          
          // Compare the full timestamps
          return dateTimeA - dateTimeB;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(activeTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the tasks array while preserving completed tasks
    const newTasks = tasks.filter(task => task.completed).concat(items);
    setTasks(newTasks);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Initialize audio only after component mounts
  const [notificationSound] = useState(() => new Audio('/d-do/meow.mp3'));

  // Update notification code to handle potential errors
  const playNotification = async (task) => {
    try {
      await notificationSound.play();
      
      if (Notification.permission === "granted") {
        new Notification("Task Reminder", {
          body: `Time for task: ${task.title}`,
          icon: "/d-do/favicon.ico"  // Updated favicon path
        });
      }
    } catch (error) {
      console.log('Notification error:', error);
    }
  };

  // Update the checkTaskNotifications function
  const checkTaskNotifications = () => {
    const now = new Date();
    tasks.forEach(task => {
      if (task.dueTime && !task.completed) {
        const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        
        if (
          now.getFullYear() === taskDateTime.getFullYear() &&
          now.getMonth() === taskDateTime.getMonth() &&
          now.getDate() === taskDateTime.getDate() &&
          now.getHours() === taskDateTime.getHours() &&
          now.getMinutes() === taskDateTime.getMinutes() &&
          now.getSeconds() === 0
        ) {
          playNotification(task);
        }
      }
    });
  };

  // Check for tasks that need notifications
  useEffect(() => {
    // Function to check if it's time to notify
    const checkTaskNotifications = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.dueTime && !task.completed) {
          const taskDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
          
          // Check if it's exactly time for the task
          if (
            now.getFullYear() === taskDateTime.getFullYear() &&
            now.getMonth() === taskDateTime.getMonth() &&
            now.getDate() === taskDateTime.getDate() &&
            now.getHours() === taskDateTime.getHours() &&
            now.getMinutes() === taskDateTime.getMinutes() &&
            now.getSeconds() === 0
          ) {
            // Play sound
            notificationSound.play();
            
            // Show notification
            if (Notification.permission === "granted") {
              new Notification("Task Reminder", {
                body: `Time for task: ${task.title}`,
                icon: "/favicon.ico"
              });
            }
          }
        }
      });
    };

    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check every second
    const interval = setInterval(checkTaskNotifications, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  // Save notes to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('notes', notes);
    } catch (error) {
      console.log('Storage access error:', error);
    }
  }, [notes]);

  return (
    <div className="App">
      <NotificationPermission />
      <div className="hero-banner">
        <p className="quote">{quote}</p>
      </div>
      <h1>Create With Heart ❤️</h1>
      
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What inspires you today?"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="sort-control">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="time">Sort by Time</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="tasks-container">
          <div className="active-tasks">
            <h2>Active Tasks</h2>
            <Droppable droppableId="active-tasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {activeTasks.map((task, index) => (
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
                          className="task-item"
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                          />
                          {task.dueTime && (
                            <span className="task-time">{formatTime(task.dueTime)}</span>
                          )}
                          <span className="task-title">{task.title}</span>
                          <PomodoroTimer />
                          <span className="task-date">{formatDate(task.dueDate)}</span>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="delete-btn"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {completedTasks.length > 0 && (
            <div className="completed-tasks">
              <h2>Completed Tasks</h2>
              <Droppable droppableId="completed-tasks">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {sortTasks(completedTasks).map((task, index) => (
                      <Draggable 
                        key={task.id} 
                        draggableId={task.id} 
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-item completed"
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTaskCompletion(task.id)}
                            />
                            <span className="task-title">{task.title}</span>
                            <span className="task-date">
                              {formatDate(task.dueDate, task.dueTime)}
                            </span>
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="delete-btn"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}

          {/* Add Notes Section */}
          <div className="notes-section">
            <h2>Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your notes here..."
              rows="4"
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default App; 