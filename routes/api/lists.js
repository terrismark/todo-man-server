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
    async (req, res) => {
        try {
            const newItem = new List({
                name: req.body.name,
                owner: req.user.userId
            })
            await newItem.save()
            
            res.status(200).json(newItem)

        } catch(error) {
            res.status(500).json({ message: 'Something went wrong... Try again' })
        }  
    }
)

// @route DELETE api/lists/:id
router.delete('/:id', auth,
    async (req, res) => {
        try {
            const item = await List.findById(req.params.id)
            await item.remove()

            res.status(200).json({ success: true })

        } catch(error) {
            res.status(500).json({ message: 'Something went wrong... Try again' })
        } 
    }
)

// @route POST api/lists/:id
router.post('/:id', auth,
    async (req, res) => {
        try {
            const newItem = new Todo({
                name: req.body.name,
                done: false
            })

            await List.findById(req.params.id, (error, item) => {
                item.todos.unshift(newItem)
                item.save()
                res.status(200).json(item.todos)
            })

        } catch(error) {
            res.status(500).json({ message: 'Something went wrong... Try again' })
        } 
    }
)

// @route PATCH api/lists/:id
router.patch('/:id', auth,
    async (req, res) => {
        try {
            await List.findById(req.params.id, (error, item) => {
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
            })
            res.status(200).json({ success: true })

        } catch(error) {
            res.status(500).json({ message: 'Something went wrong... Try again' })
        }
    }
)

export default router