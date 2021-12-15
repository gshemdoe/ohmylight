require('dotenv').config()
const express = require('express')
const router = express.Router()
const ohmyModel = require('../models/db')
const usersModel = require('../models/users')
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

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

// router.post('/post', (req, res) => {
//     let id = req.body.id
//     let title = req.body.title
//     let link = req.body.link
//     let modifiedLInk = link.replace(/\?start=/g, '&start=')
//         .replace(/https:\/\/t.me\//g, 'tg://resolve?domain=')

//     ohmyModel.create({
//         id,
//         title,
//         link: modifiedLInk,
//         originalLInk: link
//     }).then((doc) => {
//         console.log('Doc Inserted Successfully')
//         res.send(`<div style="width: 70%; margin: 16px auto;">
//         <h3>Your post is successfully to the database</h3>
//         <ul>
//             <li>Original Link: ${link}</li>
//             <li>Modified Link: ${modifiedLInk}</li>
//             <li>Shared Link: <a href="/ohmy/${id}">Hold Here</a></li>
//         </ul>
//     </div>`)
//     }).catch((err) => {
//         console.log(err)
//         res.send(err.message)
//     })
// })



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
                        bot.telegram.sendMessage(741815228, err.message)
                    })
                } else if (user.points == 0) {
                    bot.telegram.sendMessage(chatid, `You increased your points by 1 and your new points balance is <b>${user.points + 1} pts</b> \n\nAdd 1 point more to be able to download the video`, { parse_mode: 'HTML' }).then(() => {
                        console.log('+1 added')
                    }).catch((err) => {
                        console.log(err)
                        bot.telegram.sendMessage(741815228, err.message)
                    })
                } else {
                    bot.telegram.sendMessage(chatid, `You increased your points by 1 and your new points balance is <b>${user.points + 1} pts.</b>`, { parse_mode: 'HTML' }).then(() => {
                        console.log('+1 added')
                    }).catch((err) => {
                        console.log(err)
                        bot.telegram.sendMessage(741815228, err.message)
                    })
                }
                console.log(`${newNano} inserted as new nano for ${user.name} and point is added by 1`)
            }).catch((err) => {
                console.log(err)
                bot.telegram.sendMessage(741815228, err.message)
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