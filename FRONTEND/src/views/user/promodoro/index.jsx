import React, { useState, useEffect } from 'react';
import { trackPageTime } from 'utils/socket'; // WebSocket integration
import {
  Settings,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Book,
  ExternalLink,
} from 'lucide-react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState('pomodoro');
  const [showSettings, setShowSettings] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const [customSettings, setCustomSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
  });

  // Define mode configurations (always the same background; do NOT change intensities)
  const [modes, setModes] = useState({
    pomodoro: {
      name: 'Pomodoro',
      duration: 25 * 60,
      color: 'rgba(67,24,255,0.85)',
      icon: Brain,
      description: 'Focus Session',
    },
    shortBreak: {
      name: 'Short Break',
      duration: 5 * 60,
      color: '#38a169',
      icon: Coffee,
      description: 'Quick Rest',
    },
    longBreak: {
      name: 'Long Break',
      duration: 15 * 60,
      color: '#e53e3e',
      icon: Book,
      description: 'Extended Break',
    },
  });
    // User ID for tracking purposes

  const userId = JSON.parse(localStorage.getItem('user'))?._id;
  // Time tracking for page

  useEffect(() => {
    const stopTracking = trackPageTime(userId, 'pomodoro', null); // null for no specific pageId
    return () => stopTracking();
  }, [userId]);

  const trackEvent = (eventName, data) => {
    const socket = require('utils/socket').default;
    socket.emit(eventName, data);
  };

  // Update durations when custom settings change
  useEffect(() => {
    setModes((prev) => ({
      ...prev,
      pomodoro: {
        ...prev.pomodoro,
        duration: customSettings.pomodoro * 60,
      },
      shortBreak: {
        ...prev.shortBreak,
        duration: customSettings.shortBreak * 60,
      },
      longBreak: {
        ...prev.longBreak,
        duration: customSettings.longBreak * 60,
      },
    }));
  }, [customSettings]);

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(modes[currentMode].duration);
    trackEvent('switch-mode', {
      userId,
      mode: currentMode,
      timestamp: new Date().toISOString(),
    });
  }, [modes, currentMode]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsRunning(false);
    trackEvent('pomodoro-complete', {
      userId,
      mode: currentMode,
      completedAt: new Date().toISOString(),
    });

    if (currentMode === 'pomodoro') {
      setSessionsCompleted((prev) => prev + 1);
      if (customSettings.autoStartBreaks) {
        const nextMode =
          sessionsCompleted % customSettings.longBreakInterval ===
          customSettings.longBreakInterval - 1
            ? 'longBreak'
            : 'shortBreak';
        switchMode(nextMode);
        setIsRunning(true);
      }
    } else if (customSettings.autoStartPomodoros) {
      switchMode('pomodoro');
      setIsRunning(true);
    }

    const audio = new Audio('/api/placeholder/audio');
    audio.play().catch((err) => console.log('Audio play failed:', err));
  };

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Switch mode
  const switchMode = (mode) => {
    setCurrentMode(mode);
    setTimeLeft(modes[mode].duration);
    setIsRunning(false);
  };

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (currentTask.trim()) {
      setTasks([...tasks, { text: currentTask, completed: false }]);
      setCurrentTask('');
    }
  };

  // Toggle task completion
  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  // Open page in new window (user can then press F11 or use browser’s fullscreen)
  const openInNewWindow = () => {
    // Adjust the URL/path as needed. For demonstration, we open the *same* page:
    window.open(window.location.href, '_blank', 'width=1920,height=1080');
  };

  // Settings modal
  const SettingsModal = () => {
    const [tempSettings, setTempSettings] = useState(customSettings);

    if (!showSettings) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/30 backdrop-blur-sm">
        <div className="relative w-full max-w-md max-h-[90vh] overflow-auto rounded-2xl bg-white p-5 shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold">Timer Settings</h2>

          <div className="space-y-6">
            {/* Pomodoro */}
            <div>
              <label className="block mb-2">
                Pomodoro (minutes)
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.pomodoro}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      pomodoro: parseInt(e.target.value) || tempSettings.pomodoro,
                    })
                  }
                  className="mt-1 w-full rounded-lg border p-2"
                />
              </label>
            </div>

            {/* Short Break */}
            <div>
              <label className="block mb-2">
                Short Break (minutes)
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tempSettings.shortBreak}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      shortBreak:
                        parseInt(e.target.value) || tempSettings.shortBreak,
                    })
                  }
                  className="mt-1 w-full rounded-lg border p-2"
                />
              </label>
            </div>

            {/* Long Break */}
            <div>
              <label className="block mb-2">
                Long Break (minutes)
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.longBreak}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      longBreak:
                        parseInt(e.target.value) || tempSettings.longBreak,
                    })
                  }
                  className="mt-1 w-full rounded-lg border p-2"
                />
              </label>
            </div>

            {/* Long Break Interval */}
            <div>
              <label className="block mb-2">
                Long Break Interval
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tempSettings.longBreakInterval}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      longBreakInterval:
                        parseInt(e.target.value) ||
                        tempSettings.longBreakInterval,
                    })
                  }
                  className="mt-1 w-full rounded-lg border p-2"
                />
              </label>
            </div>

            {/* Auto-start Breaks */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tempSettings.autoStartBreaks}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      autoStartBreaks: e.target.checked,
                    })
                  }
                />
                Auto-start Breaks
              </label>
            </div>

            {/* Auto-start Pomodoros */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tempSettings.autoStartPomodoros}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      autoStartPomodoros: e.target.checked,
                    })
                  }
                />
                Auto-start Pomodoros
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => setShowSettings(false)}
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setCustomSettings(tempSettings);
                setTimeLeft(tempSettings[currentMode] * 60);
                setIsRunning(false);
                setShowSettings(false);
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans"
      style={{
        // Light background gradient (like your screenshot)
        // background: 'linear-gradient(135deg, #4318FF 0%, #9f87ff 100%)',
      }}
    >
      <div className="mx-auto max-w-2xl rounded-3xl bg-white/95 p-6 shadow-xl md:p-8 backdrop-blur">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
            Focus Flow
          </h1>
          <p className="text-sm md:text-base" style={{ color: modes[currentMode].color }}>
            {modes[currentMode].description}
          </p>
        </div>

        {/* Mode Buttons */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {Object.entries(modes).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-300 flex-1 min-w-[100px] max-w-[150px] hover:shadow-md ${
                currentMode === key
                  ? 'text-white'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: currentMode === key ? mode.color : '',
              }}
            >
              <mode.icon size={18} />
              <span className="hidden sm:inline">{mode.name}</span>
            </button>
          ))}
        </div>

        {/* Timer Display + Controls */}
        <div className="mb-8 text-center">
          <div
            className="mb-6 font-mono text-6xl font-bold md:text-7xl transition-all duration-500"
            style={{ color: modes[currentMode].color }}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Start/Pause */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex max-w-[200px] flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: modes[currentMode].color }}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            {/* Reset */}
            <button
              onClick={() => {
                setTimeLeft(modes[currentMode].duration);
                setIsRunning(false);
              }}
              className="flex max-w-[200px] flex-1 items-center justify-center gap-2 rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-300"
            >
              <RotateCcw size={24} />
              Reset
            </button>
          </div>
        </div>

        {/* Sessions Completed */}
        <div className="mb-8 text-center">
          <p className="text-gray-700">
            Sessions Completed: <span className="font-bold">{sessionsCompleted}</span>
          </p>
        </div>

        {/* Task List */}
        <div className="mb-6 rounded-2xl bg-gray-50 p-6 shadow-inner">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Task List</h2>
          <form onSubmit={handleAddTask} className="mb-4">
            <input
              type="text"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="Add a new task..."
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors duration-300 focus:border-blue-500 focus:outline-none"
            />
          </form>

          {/* Tasks */}
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-transform duration-300 hover:scale-[1.01]"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(index)}
                  className="h-5 w-5 cursor-pointer rounded-lg"
                />
                <span
                  className={`flex-1 ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons: Settings & Open in New Window */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setShowSettings(true)}
            className="inline-flex items-center gap-2 rounded-lg p-2 text-gray-500 transition-colors duration-300 hover:bg-gray-100"
          >
            <Settings size={24} />
            <span>Settings</span>
          </button>

          <button
            onClick={openInNewWindow}
            className="inline-flex items-center gap-2 rounded-lg p-2 text-gray-500 transition-colors duration-300 hover:bg-gray-100"
          >
            <ExternalLink size={24} />
            <span>Open in New Window</span>
          </button>
        </div>

        {/* Settings Modal Component */}
        <SettingsModal />
      </div>
    </div>
  );
};

export default PomodoroTimer;