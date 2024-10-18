const express = require('express');
const router = express.Router();
const configs = require('../util/config')
const {getAsync, setAsync} = require('../redis/index')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});


/* GET usage metadata */
router.get("/statistics", async (req, res) => {
  const addedTodos = await getAsync('added_todos')
  
  res.json({added_todos: Number(addedTodos)})
})


module.exports = router;
