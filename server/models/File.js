const { ObjectId } = require('mongodb')
const {Schema, model} = require('mongoose')

const File = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        reuired: true
    },
    accesLink: {
        type: String
    },
    size: {
        type: Number,
        default: 0
    },
    path: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: ObjectId, 
        ref: 'User'
    },
    parent: {
        type: ObjectId,
        ref: 'File'
    },
    childs: [{
        type: ObjectId,
        ref: 'File'
    }]
})

module.exports = model('File', File)