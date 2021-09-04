const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/route')
const credentials = require('./credentials.json')

const app = express()
mongoose.connect(process.env.MONGODB_URI || credentials.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database: ohmy2, connected successfully"))
    .catch((err) => console.log(err.message))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(router)


app.listen(process.env.PORT || 3000, () => console.log("Listen to port 3000"))