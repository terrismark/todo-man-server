import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    reg_date: {
        type: Date,
        default: Date.now()
    },
    lists: [{
        type: mongoose.Types.ObjectId,
        ref: 'List'
    }]
})

const User = mongoose.model('User', UserSchema)
export default User