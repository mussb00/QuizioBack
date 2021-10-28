require('dotenv').config()
const mongoose = require('mongoose')

/*
async function connect(){
    // estabish connection to db
    await mongoose.connect(process.env.CONNECTION_URL)
    console.log(process.env.CONNECTION_URL)
    console.log('connected to database!', process.env.DB_NAME)
}
*/
function disconnect(){
    mongoose.disconnect()
}

// module.exports = {connect, disconnect}
module.exports = { disconnect}