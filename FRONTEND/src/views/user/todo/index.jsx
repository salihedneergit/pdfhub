// index.js - Combined Todo App Implementation
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiMenu,
  FiX,
  FiCalendar,
  FiClock,
  FiStar,
  FiInbox,
  FiGrid,
  FiList,
  FiCheck,
  FiEdit2,
  FiTrash2,
  FiFlag,
  FiChevronDown,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiBell,
  FiRepeat,
  FiTag,
  FiAlignLeft,
} from "react-icons/fi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  format,
  setHours,
  setMinutes,
  isToday,
  isFuture,
  parseISO,
} from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { trackPageTime } from "utils/socket";
import todo from "../../../assets/icons/todo.png";
import MobileMenu from "./MobileCategoryMenu";
import MobileCategoryMenu from './MobileCategoryMenu'; 


// Categories configuration
const categories = [
  { id: "inbox", name: "Inbox", icon: FiInbox },
  { id: "today", name: "Today", icon: FiCalendar },
  { id: "upcoming", name: "Upcoming", icon: FiClock },
  { id: "important", name: "Important", icon: FiStar },
];

// Priority configuration
const priorityConfig = {
  low: {
    label: "Low Priority",
    icon: FiInfo,
    color: "text-green-500 bg-green-50",
  },
  normal: {
    label: "Normal Priority",
    icon: FiCheckCircle,
    color: "text-blue-500 bg-blue-50",
  },
  high: {
    label: "High Priority",
    icon: FiAlertCircle,
    color: "text-red-500 bg-red-50",
  },
};

// Main TodoApp Component
const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [view, setView] = useState("list");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"))._id;

  // Add tracking logic
  useEffect(() => {
    const leavePage = trackPageTime(userId, "todo", null); // Track "todo" page

    return () => {
      leavePage(); // Emit `leavePage` event on component unmount
    };
  }, [userId]);

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowNewTaskModal(true);
  };

  // const handleSaveTask = async (taskData) => {
  //   if (editingTask) {
  //     // Update existing task
  //     await handleUpdateTask(editingTask._id, taskData);
  //   } else {
  //     // Create new task
  //     await handleNewTask(taskData);
  //   }

  //   // Reset the modal
  //   setEditingTask(null);
  //   setShowNewTaskModal(false);
  // };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      // Update existing task
      await handleUpdateTask(editingTask._id, taskData);
    } else {
      // Create new task
      await handleNewTask(taskData);
    }

    // Reset the modal
    setEditingTask(null);
    setShowNewTaskModal(false);
  };

  const fetchTodos = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const { _id: userId } = JSON.parse(user);

    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/${userId}/todos`
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
      toast.error("Failed to fetch todos. Please try again.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const getCategoryCount = (categoryId) => {
    return todos.filter((todo) => {
      switch (categoryId) {
        case "today":
          return todo.dueDate && isToday(parseISO(todo.dueDate));
        case "upcoming":
          return todo.dueDate && isFuture(parseISO(todo.dueDate));
        case "important":
          return todo.priority === "high";
        default:
          return todo.category === categoryId;
      }
    }).length;
  };

  // const handleNewTask = async (taskData) => {
  //   try {
  //     const response = await axios.post(`http://localhost:3001/api/users/${userId}/todos`, taskData);
  //     setTodos((prev) => [response.data, ...prev]);
  //     toast.success('Task created successfully');
  //     fetchTodos();
  //     setShowNewTaskModal(false);
  //   } catch (error) {
  //     console.error('Error creating task:', error.message);
  //     toast.error('Failed to create task');
  //   }
  // };

  const handleNewTask = async (taskData) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/users/${userId}/todos`,
        taskData
      );

      if (response.status === 201) {
        fetchTodos();
        return response.data;
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error creating task:", error.message);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      // Send the updated fields to the backend
      const response = await axios.put(
        `http://localhost:3001/api/users/${userId}/todos/${taskId}`,
        updates
      );

      if (response.status === 200) {
        // Update the local state with the new data
        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === taskId ? { ...todo, ...response.data } : todo
          )
        );
        toast.success("Task updated successfully");
      } else {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error.message);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/users/${userId}/todos/${taskId}`
      );

      if (response.status === 200) {
        // Remove the task from local state
        setTodos((prev) => prev.filter((todo) => todo._id !== taskId));
        toast.success("Task archived successfully");
      } else {
        throw new Error("Failed to archive task");
      }
    } catch (error) {
      console.error("Error archiving task:", error.message);
      toast.error("Failed to archive task");
    }
  };

  // const handleToggleComplete = async (taskId) => {
  //   try {
  //     const task = todos.find(todo => todo.id === taskId);
  //     const updatedTask = { ...task, completed: !task.completed };
  //     await axios.put(`http://localhost:3001/api/users/${userId}/todos/${taskId}`, updatedTask);
  //     setTodos(prev =>
  //       prev.map(todo =>
  //         todo.id === taskId
  //           ? { ...todo, completed: !todo.completed }
  //           : todo
  //       )
  //     );
  //     toast.success('Task status updated');
  //   } catch (error) {
  //     console.error('Error toggling task completion:', error.message);
  //     toast.error('Failed to update task status');
  //   }
  // };

  const handleToggleComplete = async (taskId) => {
    try {
      // Find the task by ID
      const task = todos.find((todo) => todo._id === taskId);
      if (!task) {
        toast.error("Task not found");
        return;
      }

      // Toggle the completion status
      const updatedTask = { ...task, completed: !task.completed };

      // Send the update to the backend
      const response = await axios.put(
        `http://localhost:3001/api/users/${userId}/todos/${taskId}`,
        updatedTask
      );

      if (response.status === 200) {
        // Update the local state
        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === taskId
              ? { ...todo, completed: updatedTask.completed }
              : todo
          )
        );
        toast.success("Task status updated successfully");
      } else {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Error toggling task completion:", error.message);
      toast.error("Failed to update task status");
    }
  };

  const CategoryButton = ({ category, count, onClick }) => {
    const Icon = category.icon;
    return (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick ?? (() => setSelectedCategory(category.id))}
        className={`flex w-full items-center rounded-[10px] px-4 py-3 text-left
                   transition-colors duration-200
                   ${
                     selectedCategory === category.id
                       ? "bg-[#4318ffd9] text-white"
                       : "hover:bg-[#4318ffd9]/10"
                   }`}
      >
        <Icon className="mr-3 h-5 w-5" />
        <span className="font-medium">{category.name}</span>
        {count > 0 && (
          <span
            className={`ml-auto rounded-full px-2 py-1 text-sm
                         ${
                           selectedCategory === category.id
                             ? "bg-white/20 text-white"
                             : "bg-[#4318ffd9]/20 text-[#4318ffd9]"
                         }`}
          >
            {count}
          </span>
        )}
      </motion.button>
    );
  };

  const TaskItem = ({ todo, isCompact, onToggleComplete, onEdit, onDelete }) => {
    const priorityColors = {
      low: 'text-green-500',
      normal: 'text-blue-500',
      high: 'text-red-500',
    };
  
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`bg-white dark:bg-gray-800 rounded-[10px] border-l-4
                    ${
                      todo.priority === 'high'
                        ? 'border-red-500'
                        : 'border-[#4318ffd9]'
                    }
                    shadow-sm hover:shadow-md transition-all duration-200 p-4`}
      >
   {/* REMOVE THIS MOBILE HEADER FROM HERE */}
  
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleComplete(todo._id)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${
                          todo.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-[#4318ffd9]'
                        }`}
          >
            {todo.completed && <FiCheck className="w-3 h-3 text-white" />}
          </motion.button>
  
          <div className="flex-1 min-w-0">
            <p
              className={`text-gray-900 dark:text-white truncate ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.title}
            </p>
  
            {!isCompact && (todo.dueDate || todo.time || todo.priority) && (
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                {todo.dueDate && (
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <span>{/* date formatting here */}</span>
                  </div>
                )}
                {todo.time && (
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <span>{todo.time}</span>
                  </div>
                )}
                <FiFlag className={`w-4 h-4 ${priorityColors[todo.priority]}`} />
              </div>
            )}
          </div>
  
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(todo)}
              className="p-2 text-gray-600 hover:text-[#4318ffd9] rounded-lg hover:bg-[#4318ffd9]/10"
            >
              <FiEdit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(todo._id)}
              className="p-2 text-gray-600 hover:text-red-500 rounded-lg hover:bg-red-50"
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };
  

  // New Task Modal Component
  const NewTaskModal = ({ onClose, onSave, defaultCategory, editingTask }) => {
    const [taskName, setTaskName] = useState(editingTask?.title || "");
    const [dueDate, setDueDate] = useState(
      editingTask?.dueDate ? parseISO(editingTask.dueDate) : null
    );
    const [priority, setPriority] = useState(editingTask?.priority || "normal");
    const [selectedTime, setSelectedTime] = useState(editingTask?.time || null);

    // const [taskName, setTaskName] = useState('');
    // const [dueDate, setDueDate] = useState(null);
    // const [priority, setPriority] = useState('normal');
    const [showCalendar, setShowCalendar] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showTimeSelect, setShowTimeSelect] = useState(false);
    // const [selectedTime, setSelectedTime] = useState(null);

    const modalRef = useRef(null);
    const calendarRef = useRef(null);
    const timeRef = useRef(null);
    const priorityRef = useRef(null);

    useEffect(() => {
      if (editingTask) {
        setTaskName(editingTask.title || "");
        setDueDate(editingTask.dueDate ? parseISO(editingTask.dueDate) : null);
        setPriority(editingTask.priority || "normal");
        setSelectedTime(editingTask.time || null);
      } else {
        setTaskName("");
        setDueDate(null);
        setPriority("normal");
        setSelectedTime(null);
      }
    }, [editingTask]);

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const generateTimeSlots = () => {
      const slots = [];
      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
          const hour = i.toString().padStart(2, "0");
          const minute = j.toString().padStart(2, "0");
          slots.push(`${hour}:${minute}`);
        }
      }
      return slots;
    };

    const handleTimeClick = (e) => {
      e.stopPropagation();
      setShowTimeSelect(!showTimeSelect);
      setShowCalendar(false);
      setShowPriorityDropdown(false);
    };

    const handleSave = async () => {
      if (!taskName.trim()) {
        toast.error("Task name is required!");
        return;
      }

      let finalDate = dueDate;
      if (dueDate && selectedTime) {
        const [hours, minutes] = selectedTime.split(":");
        finalDate = setMinutes(
          setHours(new Date(dueDate), parseInt(hours)),
          parseInt(minutes)
        );
      }

      const taskData = {
        userId,
        title: taskName,
        taskName,
        category: defaultCategory,
        priority,
        dueDate: finalDate ? finalDate.toISOString() : null,
        time: selectedTime,
        // Only set 'completed' and 'createdAt' if creating a new task
        ...(editingTask
          ? {}
          : {
              completed: false,
              createdAt: new Date().toISOString(),
            }),
      };

      try {
        await onSave(taskData);
        // toast.success(
        //   editingTask ? 'Task updated successfully' : 'Task created successfully'
        // );
        onClose();
      } catch (error) {
        toast.error(
          editingTask ? "Failed to update task" : "Failed to create task"
        );
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSave();
      }
      if (event.key === "Escape") {
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-black/50 fixed inset-0 backdrop-blur-sm" />

        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-[10px] bg-white shadow-xl dark:bg-gray-800"
          onKeyDown={handleKeyPress}
        >
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                New Task
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What needs to be done?"
              className="mb-4 w-full rounded-[10px] border-2 border-[#4318ffd9] px-4 
                       py-3 outline-none focus:ring-2
                       focus:ring-[#4318ffd9]/30 dark:bg-gray-700 dark:text-white"
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
                  className={`flex items-center gap-2 rounded-[10px] px-4 py-2
                           ${
                             dueDate
                               ? "bg-[#4318ffd9] text-white"
                               : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700"
                           }`}
                >
                  <FiCalendar className="h-4 w-4" />
                  <span>
                    {dueDate ? format(dueDate, "MMM d, yyyy") : "Set due date"}
                  </span>
                </button>

                {showCalendar && (
                  <div className="absolute left-0 top-full z-10 mt-2">
                    <Calendar
                      onChange={(date) => {
                        setDueDate(date);
                        setShowCalendar(false);
                      }}
                      value={dueDate}
                      minDate={new Date()}
                      className="rounded-[10px] border border-gray-200 shadow-lg"
                    />
                  </div>
                )}
              </div>

              {/* Time Selection */}
              {dueDate && (
                <div className="relative" ref={timeRef}>
                  <button
                    onClick={handleTimeClick}
                    className={`flex items-center gap-2 rounded-[10px] px-4 py-2
                             ${
                               selectedTime
                                 ? "bg-[#4318ffd9] text-white"
                                 : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700"
                             }`}
                  >
                    <FiClock className="h-4 w-4" />
                    <span>{selectedTime || "Add time"}</span>
                  </button>

                  {showTimeSelect && (
                    <div
                      className="absolute left-0 top-full z-20 mt-2 max-h-60 w-48
                                 overflow-y-auto rounded-[10px] border border-gray-200 bg-white
                                 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="p-1">
                        <button
                          onClick={() => {
                            setSelectedTime(null);
                            setShowTimeSelect(false);
                          }}
                          className="w-full rounded-[10px] px-4 py-2 text-left 
                                 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                            className={`w-full rounded-[10px] px-4 py-2 text-left 
                                   hover:bg-gray-100 dark:hover:bg-gray-700
                                   ${
                                     selectedTime === time
                                       ? "bg-[#4318ffd9]/10 text-[#4318ffd9]"
                                       : ""
                                   }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Priority Selection */}
              <div className="relative" ref={priorityRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPriorityDropdown(!showPriorityDropdown);
                    setShowTimeSelect(false);
                    setShowCalendar(false);
                  }}
                  className={`flex items-center gap-2 rounded-[10px] px-4 py-2
                           ${priorityConfig[priority].color}`}
                >
                  <FiFlag className="h-4 w-4" />
                  <span>{priorityConfig[priority].label}</span>
                  <FiChevronDown
                    className={`h-4 w-4 transition-transform duration-200
                                        ${
                                          showPriorityDropdown
                                            ? "rotate-180"
                                            : ""
                                        }`}
                  />
                </button>

                {showPriorityDropdown && (
                  <div
                    className="absolute left-0 top-full z-20 mt-2 w-48 overflow-hidden
                               rounded-[10px] border border-gray-200 bg-white shadow-lg
                               dark:border-gray-700 dark:bg-gray-800"
                  >
                    {Object.entries(priorityConfig).map(([value, config]) => (
                      <button
                        key={value}
                        onClick={() => {
                          setPriority(value);
                          setShowPriorityDropdown(false);
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2
                                hover:bg-gray-50 dark:hover:bg-gray-700
                                ${value === priority ? config.color : ""}`}
                      >
                        {React.createElement(config.icon, {
                          className: "w-4 h-4",
                        })}
                        <span>{config.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-200 p-4 dark:border-gray-700">
            <button
              onClick={onClose}
              className="mr-3 px-4 py-2 text-gray-600 
                     hover:text-gray-700 dark:text-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!taskName.trim()}
              className="rounded-[10px] bg-[#4318ffd9] px-6 py-2 text-white
                     transition-colors duration-200 hover:bg-[#4318ffd9]/90
                     disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Task
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // Todo List Component
  const TodoList = ({
    todos,
    selectedCategory,
    view,
    onToggleComplete,
    onEditTask,
    onDeleteTask,
  }) => {
    const filteredTodos = todos.filter((todo) => {
      switch (selectedCategory) {
        case "today":
          return todo.dueDate && isToday(parseISO(todo.dueDate));
        case "upcoming":
          return todo.dueDate && isFuture(parseISO(todo.dueDate));
        case "important":
          return todo.priority === "high";
        default:
          return !todo.archived; // Exclude archived tasks
      }
    });

    // Start: Render Empty State
    if (filteredTodos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <img
            src={todo}
            alt="No tasks available"
            style={{ height: "150px", width: "150px" }}
          />
          <p className="mt-4 text-center text-xl text-gray-500 dark:text-gray-400">
            start by creating a new task!
          </p>
        </div>
      );
    }
    // End: Render Empty State

    return (
      <div className="overflow-hidden rounded-[10px] bg-white shadow-sm dark:bg-gray-800">
        <div className="p-6">
          <div
            className={`${
              view === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredTodos.map((todo) => (
                <TaskItem
                  key={todo._id}
                  todo={todo}
                  isCompact={view === "grid"}
                  onToggleComplete={onToggleComplete}
                  onEdit={openEditModal}
                  onDelete={onDeleteTask}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  // Main App Return
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden w-64 flex-shrink-0 md:block">
            <div className="rounded-[10px] bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="mb-6">
                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-[10px]
                           bg-[#4318ffd9] px-4 py-3
                           text-white shadow-lg shadow-[#4318ffd9]/30 transition-colors hover:bg-[#4318ffd9]/90"
                >
                  <FiPlus className="h-5 w-5" />
                  <span>Add Task</span>
                </button>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <CategoryButton
                    key={category.id}
                    category={category}
                    count={getCategoryCount(category.id)}
                  />
                ))}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-700">
                <button
                  onClick={() => setView(view === "list" ? "grid" : "list")}
                  className="flex w-full items-center rounded-[10px] px-4 py-2 
                           text-gray-600 hover:bg-[#4318ffd9]/10 hover:text-[#4318ffd9]"
                >
                  {view === "list" ? (
                    <FiGrid className="mr-3 h-5 w-5" />
                  ) : (
                    <FiList className="mr-3 h-5 w-5" />
                  )}
                  <span>Toggle View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.find((c) => c.id === selectedCategory)?.name}
              </h1>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="flex items-center gap-2 rounded-[10px] bg-[#4318ffd9] px-4
                         py-2 text-white shadow-lg
                         shadow-[#4318ffd9]/30 transition-colors hover:bg-[#4318ffd9]/90 md:hidden"
              >
                <FiPlus className="h-5 w-5" />
                <span>Add Task</span>
              </button>
            </div>

            <MobileCategoryMenu 
            categories={categories}
            selectedCategory={selectedCategory}
            getCategoryCount={getCategoryCount}
            onSelectCategory={setSelectedCategory}
          />


            <TodoList
              todos={todos}
              selectedCategory={selectedCategory}
              view={view}
              onToggleComplete={handleToggleComplete}
              onEditTask={setEditingTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewTaskModal && (
          <NewTaskModal
            onClose={() => {
              setShowNewTaskModal(false);
              setEditingTask(null); // Reset editing task when closing
            }}
            onSave={handleSaveTask}
            defaultCategory={selectedCategory}
            editingTask={editingTask} // Pass the task to edit
          />
        )}
      </AnimatePresence>
      {/* <MobileMenu
        show={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        categories={categories}
        getCategoryCount={getCategoryCount}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        CategoryButton={CategoryButton}
      /> */}
    </div>
  );
};

export default TodoApp;
