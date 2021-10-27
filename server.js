const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv');
app.use(cors())
app.use(express.json())


const userRoutes = require('./Routes/userRoutes')
const authRoutes = require('./Routes/authRoutes')
const {verifyToken} = require('./Middleware/auth')

//middleware
app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.get('/', (req, res)=>{res.send('hellooooo')})
app.use(verifyToken)


//    moved this to index.js
//app.listen(port, ()=>{
//    console.log('server is running on port', port)
// })

module.exports = app