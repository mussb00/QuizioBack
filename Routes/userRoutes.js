const {User} = require('../dbConfig/init')
const mongoose = require('mongoose')
const {connect, disconnect} = require('../Middleware/connections')
const express = require('express')
require('dotenv').config()
const router = express.Router()
const joi = require('joi')


const userControllers = require('../Controllers/userControllers')

// needed to parse data as a json, not string
router.use(express.json())

router.get('/leaderboard', userControllers.leaderboard)

router.patch('/:email', userControllers.update)

module.exports = router