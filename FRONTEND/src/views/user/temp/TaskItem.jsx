import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheck, 
  FiCalendar, 
  FiEdit2, 
  FiTrash2, 
  FiFlag,
  FiClock 
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import axios from 'axios'; 
import toast from 'react-hot-toast'; 

const TaskItem = ({ todo, isCompact, onToggleComplete, onEdit, onDelete }) => {
  const priorityColors = {
    low: 'text-green-500',
    normal: 'text-blue-500',
    high: 'text-red-500'
  };

  const handleToggleComplete = async () => {
    try {
      const updatedTask = { ...todo, completed: !todo.completed };
      await axios.put(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`, updatedTask);
      onToggleComplete(todo.id); // Update UI state
      toast.success('Task status updated');
    } catch (error) {
      console.error('Error toggling task completion:', error.message);
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`);
      onDelete(todo.id); // Update UI state
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error.message);
      toast.error('Failed to delete task');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-white dark:bg-gray-800 rounded-[10px] border-l-4
                 ${todo.priority === 'high' ? 'border-red-500' : 'border-[#4318ffd9]'}
                 shadow-sm hover:shadow-md transition-all duration-200 p-4`}
    >
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleComplete}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                   ${todo.completed 
                     ? 'bg-green-500 border-green-500' 
                     : 'border-[#4318ffd9]'}`}
        >
          {todo.completed && <FiCheck className="w-3 h-3 text-white" />}
        </motion.button>

        <div className="flex-1 min-w-0">
          <p className={`text-gray-900 dark:text-white truncate
                      ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.text}
          </p>

          {!isCompact && (todo.dueDate || todo.time) && (
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              {todo.dueDate && (
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <span>{format(parseISO(todo.dueDate), 'MMM d, yyyy')}</span>
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
            className="p-2 text-gray-600 hover:text-[#4318ffd9] 
                     rounded-lg hover:bg-[#4318ffd9]/10"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-2 text-gray-600 hover:text-red-500 
                     rounded-lg hover:bg-red-50"
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
