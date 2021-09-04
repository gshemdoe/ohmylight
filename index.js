const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/route')

const app = express()
mongoose.connect('mongodb+srv://shemdoe:Shemdoe0666@nodetuts.ngo9k.mongodb.net/ohmy2?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database: ohmy2, connected successfully"))
    .catch((err) => console.log(err.message))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(router)


app.listen(process.env.PORT || 3000, () => console.log("Listen to port 3000"))