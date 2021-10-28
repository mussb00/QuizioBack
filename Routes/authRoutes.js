const {User} = require('../dbConfig/init')
const mongoose = require('mongoose')
const {connect, disconnect} = require('../Middleware/connections')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

router.use(express.json())

router.post('/login', async (req, res) => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL)  // moved to server entrypoint index.js
        //add validation so email unique
        const user = await User.find({email: req.body.email})
        // console.log(user)
        if (!user[0]) { 
            throw new Error('No user with this email')
        }
        console.log("password ",req.body.password)
        // console.log(user[0].hashed_password)
        const authed = await bcrypt.compare(req.body.password, user[0].hashed_password);
        // console.log(authed)
        if (authed) {
            const payload = { name: user[0].username, email: user[0].email }
            // console.log(payload);
            const sendToken = (err, token) => {
                if (err) { throw new Error('Error in token generation') }
                res.status(200).json({
                    success: true,
                    token: "Bearer " + token,
                });
            } //access token formed using payload+header
            jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, sendToken)
        } else {
            throw new Error('User could not be authenticated') //password incorrect
        }
    } catch (err) {
        res.status(401).json({ err });
    }
})

// registration route
router.post('/register', async (req, res) => {
    try {
        // const data = req.body;
        // const schema = joi.object({
        //     username: joi.string().min(8).required(),
        //     email: joi.string().email().required(),
        //     password: joi.string().min(7).required(),
        //     passwordcon: joi.string().valid(joi.ref('password')).required()
        // })
        // const result = schema.validate(data)
        // console.log(result)
        // if (result.error) {
        //     // console.log(result.error.details[0].message)
        //     return res.send(result)
        // }

        console.log("Server URL1", process.env.CONNECTION_URL);

        await mongoose.connect(process.env.CONNECTION_URL)
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(req.body.password, salt);
        const username = req.body.username
        const email = req.body.email;
        

        // NEED TO CHECK IF EMAIL ALREADY EXISTS
        // const invalidEmail = await User.find({email:email})
        // if(invalidEmail){throw new Error('User with this email already exists')}

        const newUser = new User({
            username: username,
            email: email,
            hashed_password: hashed
        })
        console.log(newUser)
        await newUser.save()
        disconnect()
        return res.status(201).json({ newUser });
    } catch (err) {
        res.status(500).json({ err });
        console.log("xxxxxxxxxx",err)
    }
})

module.exports = router