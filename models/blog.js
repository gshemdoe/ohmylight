const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
        default: 'Shemdoe'
    },
    picha: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    nano: {
        type: String,
        required: true
    }
}, { timestamps: true })

const blogModel = mongoose.model('blogModel', blogSchema)
module.exports = blogModel