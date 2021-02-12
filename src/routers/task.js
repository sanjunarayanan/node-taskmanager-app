const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
      ...req.body,
      owner: req.user._id
  })
  try {
      await task.save()
      res.status(201).send(task)
  } catch (e) {
      res.status(400).send(e)
  }
})


router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
      const task = await Task.findById({ _id })
      if (!task) {
          return res.status(404).send()
      }
      res.send(task)
  } catch (e) {
      res.status(500).send()
  }
})

module.exports = router