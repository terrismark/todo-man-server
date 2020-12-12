import express from 'express'
import List from '../../models/List.js'
import Todo from '../../models/Todo.js'

import auth from '../../token_verification.js'

const router = express.Router()

// @route GET api/lists
router.get('/', auth,
    (req, res) => {
        List.find({ owner: req.user.userId })
            .sort({ date: -1 })
            .then(lists => res.json(lists))
    }
)

// @route POST api/lists
router.post('/', auth,
    (req, res) => {
        const newItem = new List({
            name: req.body.name,
            owner: req.user.userId
        })
        newItem.save()
            .then(item => res.json(item))
    }
)

// @route DELETE api/lists/:id
router.delete('/:id', auth,
    (req, res) => {
        List.findById(req.params.id)
            .then(item => item.remove()
                .then(() => res.status(200).json({ success: true })))
            .catch(e => res.status(404).json({ success: false }))
    }
)

// @route POST api/lists/:id
router.post('/:id', auth,
    (req, res) => {
        const newItem = new Todo({
            name: req.body.name,
            done: false
        })

        List.findById(req.params.id)
            .then(item => {
                item.todos.unshift(newItem)
                item.save()
                    .then(item => res.json(item.todos))
                    .catch(e => res.json({ err: "can't save" }))
            })
    }
)

// @route PATCH api/lists/:id
router.patch('/:id', auth,
    (req, res) => {
        List.findById(req.params.id, (error, item) => {
            if (req.body.type === "delete") {
                item.todos = item.todos.filter(todo => todo._id + '' !== req.body.id)
            } else {
                item.todos = item.todos.map(todo => {
                    if (todo._id + '' === req.body.id) {
                        if (req.body.type === "rename") {
                            todo.name = req.body.name
                            todo.date = Date.now()
                        } else if (req.body.type === "complete") {
                            todo.done = !todo.done
                            todo.date = Date.now()
                        } 
                    } return todo
                })
            }
            item.save()
                .catch(e => res.json({ err: "can't do this!" }))
        })
            .then(() => res.status(200).json({ success: true }))
            .catch(e => res.status(404).json({ success: false }))
    }
)

export default router