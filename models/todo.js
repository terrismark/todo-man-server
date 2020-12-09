import mongoose from 'mongoose'

const TodoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Todo = mongoose.model('Todo', TodoSchema)
export default Todo