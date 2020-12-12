import mongoose from 'mongoose'

const ListSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    todos: [{
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
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

const List = mongoose.model('List', ListSchema)
export default List
