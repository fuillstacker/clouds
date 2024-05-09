const { ObjectId } = require('mongodb')
const {Schema, model} = require('mongoose')


const User = new Schema({
    email: {
        type: String,
        required: true,
        uniqe: true
    },
    password: {
        type: String,
        unique: true
    },
    diskSpace: {
        type: Number,
        default: 1024**3*10
    },
    useSpace: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String
    },
    files: [{type: ObjectId, ref:'File'}]
})

module.exports = model('User', User)