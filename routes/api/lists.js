import express from 'express'
import List from '../../models/list.js'

const router = express.Router()

// @route GET api/lists
router.get('/', 
    (req, res) => {
        List.find()
            .sort({ date: -1 })
            .then(lists => res.json(lists))
    }
)

// @route POST api/lists
router.post('/', 
    (req, res) => {
        const newItem = new List({
            name: req.body.name
        })
        newItem.save()
            .then(item => res.json(item))
    }
)

// @route DELETE api/lists/:id
router.delete('/:id', 
    (req, res) => {
        List.findById(req.params.id)
            .then(item => item.remove()
                .then(() => res.status(200).json({ success: true })))
            .catch(e => res.status(404).json({ success: false }))
    }
)

export default router