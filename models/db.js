const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ohmySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    originalLInk: {
        type: String,
        required: true,
        unique: true
    }
},
    { timestamps: true, strict: false },
)

const model = mongoose.model('ohmyModel', ohmySchema)
module.exports = model