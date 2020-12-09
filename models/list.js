import mongoose from 'mongoose'

const ListSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const List = mongoose.model('List', ListSchema)
export default List