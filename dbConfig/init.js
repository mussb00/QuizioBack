const mongoose = require('mongoose')

// create schema
// mongo adds id property by default
const userSchema = new mongoose.Schema({
    username: String,
    // email: String,
    // hash: String,
    // total_games: Number,
    // total_scores: Number
})

// create User Class
const User = mongoose.model('User', userSchema)


module.exports = {User}