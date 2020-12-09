import express from 'express'
import Todo from '../../models/todo.js'

const router = express.Router()

// @route GET api/todos
router.get('/', 
    (req, res) => {
        Todo.find()
            .sort({ date: -1 })
            .then(todos => res.json(todos))
    }
)

// @route POST api/todos
router.post('/', 
    (req, res) => {
        const newItem = new Todo({
            name: req.body.name,
            done: false
        })
        newItem.save()
            .then(item => res.json(item))
    }
)

// @route DELETE api/todos/:id
router.delete('/:id', 
    (req, res) => {
        Todo.findById(req.params.id)
            .then(item => item.remove()
                .then(() => res.status(200).json({ success: true })))
            .catch(e => res.status(404).json({ success: false }))
    }
)

// @route PATCH api/todos/:id
router.patch('/:id', 
    (req, res) => {
        Todo.findById(req.params.id, (error, item) => {
            if (req.body.name) {
                item.name = req.body.name
                item.date = Date.now()
            } else {
                item.done = !item.done
                item.date = Date.now()
            }
            item.save()
                .catch(e => res.json({ err: "can't edit!" }))
        })
            .then(() => res.status(200).json({ success: true }))
            .catch(e => res.status(404).json({ success: false }))
    }
)

export default router