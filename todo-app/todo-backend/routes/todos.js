const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const {getAsync, setAsync} = require('../redis/index')


/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  // Increment added_todos in Redis
  const currentTodosCount = await getAsync('added_todos')
  const newTodosCount = currentTodosCount ? Number(currentTodosCount) + 1 : 0
  await setAsync('added_todos', newTodosCount)

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;
  const todo = req.todo;

  if (text === undefined || done === undefined) {
    return res.status(400).json({error: 'Text and done are required!'})
  }

  todo.text = text
  todo.done = done

  await todo.save();
  
  res.send(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
