import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiCalendar, 
  FiChevronDown, 
  FiFlag,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiClock
} from 'react-icons/fi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, setHours, setMinutes } from 'date-fns';
import axios from 'axios'; // Import axios for API calls
import toast from 'react-hot-toast'; // Import toast for notifications

const NewTaskModal = ({ onClose, onSave, defaultCategory }) => {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState('normal');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showTimeSelect, setShowTimeSelect] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const modalRef = useRef(null);
  const calendarRef = useRef(null);
  const timeRef = useRef(null);
  const priorityRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTimeClick = (e) => {
    e.stopPropagation();
    setShowTimeSelect(!showTimeSelect);
    setShowCalendar(false);
    setShowPriorityDropdown(false);
  };

  const handleSave = async () => {
    if (!taskName.trim()) return;

    let finalDate = dueDate;
    if (dueDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      finalDate = setMinutes(setHours(new Date(dueDate), parseInt(hours)), parseInt(minutes));
    }

    const userId = JSON.parse(localStorage.getItem('user'))._id;

    const newTask = {
      userId:userId,
      title: taskName,
      taskName,
      completed: false,
      category: defaultCategory,
      priority,
      dueDate: finalDate ? finalDate.toISOString() : null,
      time: selectedTime,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`http://13.51.106.41:3001/api/users/${userId}/todos`, newTask);
      onSave(response.data); 
      toast.success('Task created successfully');
      onClose();
    } catch (error) {
      console.error('Error creating task:', error.message);
      toast.error('Failed to create task');
    }
  };

  const priorityConfig = {
    low: {
      label: 'Low Priority',
      icon: FiInfo,
      color: 'text-green-500 bg-green-50'
    },
    normal: {
      label: 'Normal Priority',
      icon: FiCheckCircle,
      color: 'text-blue-500 bg-blue-50'
    },
    high: {
      label: 'High Priority',
      icon: FiAlertCircle,
      color: 'text-red-500 bg-red-50'
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    }
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-[10px] shadow-xl"
        onKeyDown={handleKeyPress}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              New Task
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 rounded-[10px] border-2 border-[#4318ffd9] 
                     outline-none focus:ring-2 focus:ring-[#4318ffd9]/30
                     dark:bg-gray-700 dark:text-white mb-4"
            autoFocus
          />

          <div className="flex flex-wrap gap-3">
            {/* Due Date Button */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalendar(!showCalendar);
                  setShowTimeSelect(false);
                  setShowPriorityDropdown(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-[10px]
                         ${dueDate 
                           ? 'bg-[#4318ffd9] text-white' 
                           : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700'
                         }`}
              >
                <FiCalendar className="w-4 h-4" />
                <span>
                  {dueDate ? format(dueDate, 'MMM d, yyyy') : 'Set due date'}
                </span>
              </button>

              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 z-10">
                  <Calendar
                    onChange={(date) => {
                      setDueDate(date);
                      setShowCalendar(false);
                    }}
                    value={dueDate}
                    minDate={new Date()}
                    className="border border-gray-200 rounded-[10px] shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Time Selection */}
            {dueDate && (
              <div className="relative" ref={timeRef}>
                <button
                  onClick={handleTimeClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[10px]
                           ${selectedTime 
                             ? 'bg-[#4318ffd9] text-white' 
                             : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700'
                           }`}
                >
                  <FiClock className="w-4 h-4" />
                  <span>{selectedTime || 'Add time'}</span>
                </button>

                {showTimeSelect && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800
                               rounded-[10px] shadow-lg border border-gray-200 dark:border-gray-700
                               max-h-60 overflow-y-auto z-20">
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setSelectedTime(null);
                          setShowTimeSelect(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 
                               dark:hover:bg-gray-700 rounded-[10px]"
                      >
                        No time
                      </button>
                      {generateTimeSlots().map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setShowTimeSelect(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 
                                 dark:hover:bg-gray-700 rounded-[10px]
                                 ${selectedTime === time ? 'bg-[#4318ffd9]/10 text-[#4318ffd9]' : ''}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Priority Dropdown */}
            <div className="relative" ref={priorityRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPriorityDropdown(!showPriorityDropdown);
                  setShowTimeSelect(false);
                  setShowCalendar(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-[10px]
                         ${priorityConfig[priority].color}`}
              >
                <FiFlag className="w-4 h-4" />
                <span>{priorityConfig[priority].label}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-200
                                      ${showPriorityDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showPriorityDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800
                             rounded-[10px] shadow-lg border border-gray-200 dark:border-gray-700
                             overflow-hidden z-20">
                  {Object.entries(priorityConfig).map(([value, config]) => (
                    <button
                      key={value}
                      onClick={() => {
                        setPriority(value);
                        setShowPriorityDropdown(false);
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-2
                              hover:bg-gray-50 dark:hover:bg-gray-700
                              ${value === priority ? config.color : ''}`}
                    >
                      {React.createElement(config.icon, { className: "w-4 h-4" })}
                      <span>{config.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-700 
                   dark:text-gray-400 mr-3"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!taskName.trim()}
            className="bg-[#4318ffd9] text-white px-6 py-2 rounded-[10px]
                   hover:bg-[#4318ffd9]/90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
          >
            Create Task
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewTaskModal;
