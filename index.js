const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/route')
require('dotenv').config()

//credentials
let USER = process.env.USER
let PASS = process.env.PASS

const app = express()
mongoose.connect(`mongodb+srv://${USER}:${PASS}@nodetuts.ngo9k.mongodb.net/ohmyNew?retryWrites=true&w=majority`).then(() => {
    console.log('Connected to ohmyNew database')
}).catch((err) => console.log(err.message))

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)
app.use(express.static(__dirname + '/public'))
app.listen(process.env.PORT || 3000, () => console.log("Listen to port 3000"))