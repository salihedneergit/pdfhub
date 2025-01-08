import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiX, 
  FiCalendar, 
  FiBell, 
  FiStar, 
  FiRepeat,
  FiTag,
  FiPlus,
  FiTrash2,
  FiAlignLeft
} from 'react-icons/fi';
import axios from 'axios'; 
import toast from 'react-hot-toast'; 

const TodoDetailModal = ({ todo, onClose, onUpdate, onDelete, onAddSubtask }) => {
  const [newSubtask, setNewSubtask] = useState('');
  const [notes, setNotes] = useState(todo.notes || '');

  const handlePriorityChange = async (priority) => {
    try {
      await axios.put(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`, { priority });
      onUpdate(todo.id, { priority });
      toast.success('Priority updated successfully');
    } catch (error) {
      console.error('Error updating priority:', error.message);
      toast.error('Failed to update priority');
    }
  };

  const handleDateSelect = async (date) => {
    try {
      await axios.put(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`, { dueDate: date });
      onUpdate(todo.id, { dueDate: date });
      toast.success('Due date updated successfully');
    } catch (error) {
      console.error('Error updating due date:', error.message);
      toast.error('Failed to update due date');
    }
  };

  const handleRepeatToggle = async () => {
    try {
      const updatedRepeating = !todo.repeating;
      await axios.put(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`, { repeating: updatedRepeating });
      onUpdate(todo.id, { repeating: updatedRepeating });
      toast.success('Repeat status updated successfully');
    } catch (error) {
      console.error('Error toggling repeat status:', error.message);
      toast.error('Failed to update repeat status');
    }
  };

  const handleSubtaskAdd = async () => {
    if (newSubtask.trim()) {
      try {
        const updatedSubtasks = [...todo.subtasks, { id: Date.now(), text: newSubtask, completed: false }];
        await axios.put(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`, { subtasks: updatedSubtasks });
        onAddSubtask(todo.id, newSubtask);
        setNewSubtask('');
        toast.success('Subtask added successfully');
      } catch (error) {
        console.error('Error adding subtask:', error.message);
        toast.error('Failed to add subtask');
      }
    }
  };

  const handleNotesUpdate = async () => {
    try {
      await axios.put(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`, { notes });
      onUpdate(todo.id, { notes });
      toast.success('Notes updated successfully');
    } catch (error) {
      console.error('Error updating notes:', error.message);
      toast.error('Failed to update notes');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <input
                type="text"
                defaultValue={todo.text}
                onBlur={async (e) => {
                  try {
                    const updatedText = e.target.value;
                    await axios.put(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`, { text: updatedText });
                    onUpdate(todo.id, { text: updatedText });
                    toast.success('Task updated successfully');
                  } catch (error) {
                    console.error('Error updating task:', error.message);
                    toast.error('Failed to update task');
                  }
                }}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none
                         text-gray-900 dark:text-white w-full"
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handlePriorityChange(todo.priority === 'high' ? 'normal' : 'high')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                           ${todo.priority === 'high'
                      ? 'bg-[#4318ffd9] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-[#4318ffd9]/10'
                    }`}
                >
                  <FiStar className="w-4 h-4" />
                  <span>Priority</span>
                </button>

                <button
                  onClick={() => handleDateSelect(new Date())}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg
                           ${todo.dueDate
                      ? 'bg-[#4318ffd9] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-[#4318ffd9]/10'
                    }`}
                >
                  <FiCalendar className="w-4 h-4" />
                  <span>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'Add due date'}</span>
                </button>

                <button
                  onClick={handleRepeatToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg
                           ${todo.repeating
                      ? 'bg-[#4318ffd9] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-[#4318ffd9]/10'
                    }`}
                >
                  <FiRepeat className="w-4 h-4" />
                  <span>Repeat</span>
                </button>
              </div>

              {/* Subtasks */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtasks</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add subtask..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                           focus:border-[#4318ffd9] focus:ring-1 focus:ring-[#4318ffd9]
                           dark:bg-gray-700"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSubtaskAdd();
                    }}
                  />
                  <button
                    onClick={handleSubtaskAdd}
                    className="p-2 bg-[#4318ffd9] text-white rounded-lg hover:bg-[#4318ffd9]/90"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {todo.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={async () => {
                          try {
                            const updatedSubtasks = todo.subtasks.map(st =>
                              st.id === subtask.id ? { ...st, completed: !st.completed } : st
                            );
                            await axios.put(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`, { subtasks: updatedSubtasks });
                            onUpdate(todo.id, { subtasks: updatedSubtasks });
                            toast.success('Subtask updated successfully');
                          } catch (error) {
                            console.error('Error updating subtask:', error.message);
                            toast.error('Failed to update subtask');
                          }
                        }}
                        className="rounded border-gray-300 text-[#4318ffd9]"
                      />
                      <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                        {subtask.text}
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            const updatedSubtasks = todo.subtasks.filter(st => st.id !== subtask.id);
                            await axios.put(`http://13.51.106.41:3001/api/users/${todo.userId}/todos/${todo.id}`, { subtasks: updatedSubtasks });
                            onUpdate(todo.id, { subtasks: updatedSubtasks });
                            toast.success('Subtask deleted successfully');
                          } catch (error) {
                            console.error('Error deleting subtask:', error.message);
                            toast.error('Failed to delete subtask');
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FiAlignLeft className="w-4 h-4" />
                  Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={handleNotesUpdate}
                  placeholder="Add notes..."
                  className="w-full h-32 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                         focus:border-[#4318ffd9] focus:ring-1 focus:ring-[#4318ffd9]
                         dark:bg-gray-700 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(todo.id);
                    onClose();
                  }
                }}
                className="text-red-500 hover:text-red-600 flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete task
              </button>
              <div className="text-sm text-gray-500">
                Created {new Date(todo.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TodoDetailModal;
