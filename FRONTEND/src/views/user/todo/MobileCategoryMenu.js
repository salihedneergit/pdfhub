// MobileCategoryMenu.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * MobileCategoryMenu (Dropdown style)
 *
 * Displays categories in a dropdown that is closed by default.
 * On mobile screens only (hidden on md+ by default).
 *
 * Props:
 * - categories: [{ id, name, icon }, ...]
 * - selectedCategory: string (the ID of the currently selected category)
 * - getCategoryCount: function(categoryId) => number
 * - onSelectCategory: function(categoryId)
 */
function MobileCategoryMenu({
  categories,
  selectedCategory,
  getCategoryCount,
  onSelectCategory,
}) {
  // Controls open/close of the dropdown
  const [open, setOpen] = useState(false);

  // Find the currently selected category object
  const selectedItem = categories.find((item) => item.id === selectedCategory);

  return (
    <div className="md:hidden block px-4 py-4">
      {/* The 'dropdown button' - shows the selected category's name or a fallback */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3
                   flex items-center justify-between dark:bg-gray-700
                   dark:text-gray-200"
      >
        <span>{selectedItem ? selectedItem.name : 'Select Category'}</span>
        {open ? (
          <FiChevronUp className="w-5 h-5" />
        ) : (
          <FiChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* The dropdown content */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-dropdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white dark:bg-gray-800 
                       shadow-md rounded-lg mt-2"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = getCategoryCount(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setOpen(false); // Close the dropdown after selecting
                  }}
                  className={`flex items-center w-full px-4 py-3 text-left
                              hover:bg-gray-100 dark:hover:bg-gray-700
                              ${
                                selectedCategory === cat.id
                                  ? 'bg-gray-200 dark:bg-gray-700 font-medium'
                                  : ''
                              }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className="ml-auto px-2 py-1 text-xs rounded-full 
                                    bg-gray-200 dark:bg-gray-600">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileCategoryMenu;
