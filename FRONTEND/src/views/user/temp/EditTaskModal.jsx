import React, { useState } from 'react';
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
import axios from 'axios';

const EditTaskModal = ({ task, onClose, onSave, onDelete }) => {

  const userId = JSON.parse(localStorage.getItem('user'))._id;

  const [taskName, setTaskName] = useState(task.text);
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate) : null);
  const [priority, setPriority] = useState(task.priority || 'normal');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showTimeSelect, setShowTimeSelect] = useState(false);
  const [selectedTime, setSelectedTime] = useState(task.time || null);

  const handleSave = async () => {
    if (!taskName.trim()) return;

    let finalDate = dueDate;
    if (dueDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      finalDate = setMinutes(setHours(dueDate, parseInt(hours)), parseInt(minutes));
    }

    try {
      const updatedTask = {
        text: taskName,
        dueDate: finalDate ? finalDate.toISOString() : null,
        time: selectedTime,
        priority,
      };

      await axios.put(`http://13.51.106.41:3001/api/users/${task.userId}/todos/${task.id}`, updatedTask);
      onSave(task.id, updatedTask); // Update the state in the parent component
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://13.51.106.41:3001/api/users/${task.userId}/todos/${task.id}`);
      onDelete(task.id); // Update the state in the parent component
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error.message);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-[10px] shadow-xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Task
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
            placeholder="Task name"
            className="w-full px-4 py-3 rounded-[10px] border-2 border-[#4318ffd9] 
                     outline-none focus:ring-2 focus:ring-[#4318ffd9]/30
                     dark:bg-gray-700 dark:text-white mb-4"
          />

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
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

              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 z-10"
                  >
                    <Calendar
                      onChange={(date) => {
                        setDueDate(date);
                        setShowCalendar(false);
                      }}
                      value={dueDate}
                      minDate={new Date()}
                      className="border border-gray-200 rounded-[10px] shadow-lg"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {dueDate && (
              <div className="relative">
                <button
                  onClick={() => setShowTimeSelect(!showTimeSelect)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[10px]
                           ${selectedTime 
                             ? 'bg-[#4318ffd9] text-white' 
                             : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700'
                           }`}
                >
                  <FiClock className="w-4 h-4" />
                  <span>{selectedTime || 'Add time'}</span>
                </button>

                <AnimatePresence>
                  {showTimeSelect && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800
                             rounded-[10px] shadow-lg border border-gray-200 dark:border-gray-700
                             max-h-60 overflow-y-auto z-20"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[10px]
                         ${priorityConfig[priority].color}`}
              >
                <FiFlag className="w-4 h-4" />
                <span>{priorityConfig[priority].label}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-200
                                      ${showPriorityDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showPriorityDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800
                           rounded-[10px] shadow-lg border border-gray-200 dark:border-gray-700
                           overflow-hidden z-20"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 
                     flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 px-4 py-2 rounded-[10px]
                     hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Delete Task
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!taskName?.trim()}
              className="bg-[#4318ffd9] text-white px-6 py-2 rounded-[10px]
                     hover:bg-[#4318ffd9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditTaskModal;
