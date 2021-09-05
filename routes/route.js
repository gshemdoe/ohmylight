const express = require('express')
const router = express.Router()
const ohmyModel = require('../models/db')

router.get('/', (req, res) => {
    res.render('home')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    if (username == 'shemdoe' && password == '5654') {
        res.render('posting')
    } else {
        res.render('home')
    }
})

router.post('/post', (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let link = req.body.link
    let modifiedLInk = link.replace(/\?start=/g, '&start=')
        .replace(/https:\/\/t.me\//g, 'tg://resolve?domain=')

    ohmyModel.create({
        id,
        title,
        link: modifiedLInk,
        originalLInk: link
    }).then((doc) => {
        console.log('Doc Inserted Successfully')
        res.send(`<div style="width: 70%; margin: 16px auto;">
        <h3>Your post is successfully to the database</h3>
        <ul>
            <li>Original Link: ${link}</li>
            <li>Modified Link: ${modifiedLInk}</li>
            <li>Shared Link: <a href="/ohmy/${id}">Hold Here</a></li>
        </ul>
    </div>`)
    }).catch((err) => {
        console.log(err)
        res.send(err.message)
    })
})

router.get('/ohmy/:id', (req, res) => {
    let id = req.params.id

    ohmyModel.findOne({ id: id }).then((result) => {
        res.render('subpage', { result })
    }).catch((err) => {
        console.log(err)
        res.send(err.message)
    })
})

module.exports = router