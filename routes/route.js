require('dotenv').config()
const express = require('express')
const router = express.Router()
const ohmyModel = require('../models/db')
const usersModel = require('../models/users')
const { Telegraf } = require('telegraf')
const blogModel = require('../models/blog')
const countModel = require('../models/count')
const { nanoid } = require('nanoid')
const bot = new Telegraf(process.env.BOT_TOKEN)

router.get('/', (req, res) => {
    blogModel.find().limit(6).then(async (posts) => {
        let count = await usersModel.countDocuments()
        let files = await ohmyModel.countDocuments()
        countModel.findOne({}).then(doc => {
            res.render('home', { posts, count, doc, files })
        }).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        console.log(err)
    })
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

router.post('/post', async (req, res) => {
    const title = req.body.title
    const author = req.body.author
    const picha = req.body.picha
    const Rawbody = req.body.body
    const body = Rawbody.replace(/\n/g, '<br>')
    let nanoGenerate = await nanoid(5)
    let nano = nanoGenerate

    blogModel.create({
        title, author, picha, body, nano
    }).then(() => res.send('Blog article posted'))
        .catch((err) => {
            console.log(err)
            res.send('There was an error and post didnt posted')
        })
})



router.get('/ohmy/:id', (req, res) => {
    let id = req.params.id

    ohmyModel.findOne({ nano: id }).then((result) => {
        res.render('subpage', { result })
    }).catch((err) => {
        console.log(err)
        res.send(err.message)
    })
})

router.get('/telegram/:id', (req, res) => {
    let id = req.params.id

    ohmyModel.findOne({ nano: id }).then((result) => {
        res.render('telegram', { result })
    }).catch((err) => {
        console.log(err)
        res.send(err.message)
    })
})

router.get('/code/:id', (req, res) => {
    let id = req.params.id

    ohmyModel.findOne({ nano: id }).then((result) => {
        res.render('code/subpage', { result })
    }).catch((err) => {
        console.log(err)
        res.send(err.message)
    })
})

router.get('/boost/:id/add', (req, res) => {
    let id = req.params.id

    usersModel.findOne({ chatid: id }).then((user) => {
        bot.telegram.getChat(id).then((member) => {
            let userInfo = {
                id: user.chatid,
                name: member.first_name,
                points: user.points,
                unano: user.unano
            }
            res.render('boost/boost', { userInfo })
        })

    }).catch((err) => {
        console.log(err)
    })
})

router.get('/ohmy-user-add-1/:unano/:chatid', (req, res) => {
    let unano = req.params.unano
    let chatid = req.params.chatid

    usersModel.findOne({ chatid }).then((user) => {
        if (user.unano == unano) {
            let randomNo = Math.floor(Math.random() * 1000000)
            let newNano = `user${randomNo}`

            user.updateOne({ unano: newNano, points: (user.points + 1) }).then(() => {
                res.redirect(`/boost/${user.chatid}/add`)
                if (user.points == 1) {
                    bot.telegram.sendMessage(chatid, `You increased your points by 1 and your new points balance is <b>${user.points + 1} pts</b> \n\nNow you are able to download the video`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: 'Open 💋 OhMy Channel', url: 'https://t.me/joinchat/V6CN2nFJKa1JezKS' }
                                ]
                            ]
                        }
                    }).then(() => console.log('+1 msg sent')).catch((err) => {
                        console.log(err)
                        bot.telegram.sendMessage(741815228, err.message + ` from ${chatid} - Website`)
                    })
                } else if (user.points == 0) {
                    bot.telegram.sendMessage(chatid, `You increased your points by 1 and your new points balance is <b>${user.points + 1} pts</b> \n\nAdd 1 point more to be able to download the video`, { parse_mode: 'HTML' }).then(() => {
                        console.log('+1 added')
                    }).catch((err) => {
                        console.log(err)
                        bot.telegram.sendMessage(741815228, err.message + ` from ${chatid} - Website`)
                    })
                } else {
                    bot.telegram.sendMessage(chatid, `You increased your points by 1 and your new points balance is <b>${user.points + 1} pts.</b>`, { parse_mode: 'HTML' }).then(() => {
                        console.log('+1 added')
                    }).catch((err) => {
                        console.log(err)
                        bot.telegram.sendMessage(741815228, err.message + ` from ${chatid} - Website`)
                    })
                }
                console.log(`${newNano} inserted as new nano for ${user.name} and point is added by 1`)
            }).catch((err) => {
                console.log(err)
                bot.telegram.sendMessage(741815228, err.message + ` from ${chatid} - Website`)
            })
        } else {
            res.status(400).send('<h2>Error: Bad link, user session expired</h2>')
        }
    }).catch((err) => {
        console.log(err)
        bot.telegram.sendMessage(741815228, err.message)
    })
})

module.exports = router