import React from 'react';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Create With Heart ❤️</h1>
      </header>
      <main>
        <AddTaskForm />
        <TaskList />
      </main>
    </div>
  );
}

export default App; 