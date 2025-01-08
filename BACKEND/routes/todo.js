const express = require('express');
const router = express.Router();

const {
  addTodo,
  updateTodo,
  deleteTodo,
  getTodos,
} = require('../controllers/Todo');


router.post('/:userId/todos', addTodo);
router.put('/:userId/todos/:todoId', updateTodo);
router.delete('/:userId/todos/:todoId', deleteTodo);
router.get('/:userId/todos', getTodos);

module.exports = router;
