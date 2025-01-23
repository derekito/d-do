import React, { useState, useEffect } from 'react';

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const notificationSound = new Audio('/d-do/meow.mp3');

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      // Update browser tab title
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.title = `(${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}) Create With Heart`;
    } else if (timeLeft === 0) {
      setIsRunning(false);
      notificationSound.play();
      document.title = 'Create With Heart';
      
      if (Notification.permission === "granted") {
        new Notification(isBreak ? "Break Complete!" : "Pomodoro Complete!", {
          body: isBreak ? "Ready to work?" : "Time for a break!",
        });
      }
    }

    return () => {
      clearInterval(timer);
      document.title = 'Create With Heart';
    };
  }, [isRunning, timeLeft, isBreak]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    setIsRunning(false);
  };

  const toggleBreak = () => {
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="pomodoro-timer">
      <span className="timer-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      <button 
        onClick={toggleTimer} 
        className="timer-btn" 
        title={isRunning ? "Pause" : "Start"}
      >
        {isRunning ? '⏸' : '▶️'}
      </button>
      <button 
        onClick={resetTimer} 
        className="timer-btn" 
        title="Reset"
      >
        🔄
      </button>
      <button 
        onClick={toggleBreak} 
        className={`timer-btn ${isBreak ? 'break-btn' : ''}`} 
        title={isBreak ? "Switch to Work (25min)" : "Switch to Break (5min)"}
      >
        {isBreak ? '💪' : '☕'}
      </button>
    </div>
  );
} 