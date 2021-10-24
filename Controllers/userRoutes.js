const {User} = require('../dbConfig/init')
const mongoose = require('mongoose')
const {connect, disconnect} = require('../Middleware/connections')
const express = require('express')
require('dotenv').config()
const router = express.Router()
const joi = require('joi')

// needed to parse data as a json, not string
router.use(express.json())


// find user by username
router.get('/:username', async (req, res) => {
    try {
        // connect()
        await mongoose.connect(process.env.CONNECTION_URL)
        const user  = await User.find({username: req.params.username})
        res.status(200).send(user)
        disconnect()
    } catch (err) {
        // console.log('failed')
        res.status(404).send('User does not exist')
    }
})

// create new user and store in db
router.post('/', async (req, res) => {
    try{
        await mongoose.connect(process.env.CONNECTION_URL)
        const newUser = new User({
            username: req.body.username
        })
        console.log(newUser)
        await newUser.save()
        disconnect()
    } catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
})

module.exports = router