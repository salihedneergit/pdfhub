const User = require('../models/User');
const mongoose = require('mongoose');

exports.addTodo = async (req, res) => {
  try {
    const { userId, title, taskName, dueDate, time, priority } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    const newTodo = { title, taskName, dueDate, time, priority, _id: new mongoose.Types.ObjectId() }; 
    user.todos.push(newTodo);
    await user.save();

    res.status(201).send(newTodo); 
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

  

// Update a todo
exports.updateTodo = async (req, res) => {
    try {
      const { userId, todoId } = req.params;
      const updates = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).send('User not found');
  
      const todo = user.todos.id(todoId);
      if (!todo) return res.status(404).send('Todo not found');
  
      Object.assign(todo, updates);
      await user.save();
  
      res.send(todo); // Return the updated todo
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const { userId, todoId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    const todo = user.todos.id(todoId);
    if (!todo) return res.status(404).send('Todo not found');

    todo.archived = true; 
    await user.save();

    res.status(200).send({ todoId });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


// Fetch all todos
exports.getTodos = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('todos');
    if (!user) return res.status(404).send('User not found');

    const activeTodos = user.todos.filter((todo) => !todo.archived);

    res.send(activeTodos);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


