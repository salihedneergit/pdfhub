import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import { isToday, isFuture, parseISO } from 'date-fns';
import axios from 'axios'; // Import axios for API calls

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
      case 'today':
        return todo.dueDate && isToday(parseISO(todo.dueDate));
      case 'upcoming':
        return todo.dueDate && isFuture(parseISO(todo.dueDate));
      case 'important':
        return todo.priority === 'high';
      default:
        return todo.category === selectedCategory;
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-sm overflow-hidden">
      <div className="p-6">
        <div
          className={`${
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredTodos.map((todo) => (
              <TaskItem
                key={todo._id}
                todo={todo}
                isCompact={view === 'grid'}
                onToggleComplete={onToggleComplete}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


export default TodoList;
