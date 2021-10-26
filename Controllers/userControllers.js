const {User} = require('../dbConfig/init')
const mongoose = require('mongoose')
const {connect, disconnect} = require('../Middleware/connections')
const express = require('express')
require('dotenv').config()
const router = express.Router()
const joi = require('joi')



 async function leaderboard(req, res) {
    try{
        await mongoose.connect(process.env.CONNECTION_URL)
        const allUsers = await User.find()
        // orders score from highest to lowest
        const orderedList = allUsers.map(user => user.total_scores).sort((a,b)=> b-a)
        const topFive = orderedList.slice(0,5)
        res.send(topFive)
    } catch (err) {
        res.status(404).send(err)
    }
}


 async function update(req, res) {
    try {
        await mongoose.connect(process.env.CONNECTION_URL)

        const user = await User.updateOne({email: req.params.email}, {$inc: {
        total_games: 1,
        total_scores: req.body.total_scores
        }})
        
        res.send(user)
        disconnect()

    } catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
}

module.exports = {update, leaderboard}