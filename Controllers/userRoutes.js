const { User } = require('../dbConfig/init')
const mongoose = require('mongoose')
const { disconnect } = require('../Middleware/connections')
const express = require('express')
require('dotenv').config()
const router = express.Router()
const joi = require('joi')
const { verifyToken } = require('../Middleware/auth')

// needed to parse data as a json, not string
router.use(express.json())

router.get('/leaderboard', async (req, res) => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL)
        const usersWithScores = await  User.find({total_scores: {$ne : null}}).sort({total_scores:-1}).slice(0,5)
        res.send(usersWithScores)
        // orders score from highest to lowest
        // const orderedList = allUsers.map(user => user.total_scores).sort((a, b) => b - a)
        // const topFive = orderedList.slice(0, 5)
        // res.send(topFive)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/:emails', async (req, res) => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL)
        const emailString = req.params.emails
        const emailArray = emailString.split('*')
        
        const usersInRoom = await Promise.all(emailArray.map(email => User.findOne({email: email})))
        res.send(usersInRoom)
    } catch (err) {
        res.status(404).send(err)
    }
})

router.patch('/:email',verifyToken, async (req, res) => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL)

        let user = await User.updateOne({ email: req.params.email }, {
            $inc: {
                total_games: 1,
                total_scores: req.body.game_score
            }
        })

        user = await User.updateOne({email:req.params.email},
            {last_score: req.body.game_score})

        res.send(user)
        disconnect()

    } catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})

module.exports = router