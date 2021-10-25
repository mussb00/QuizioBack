const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const userRoutes = require('./Controllers/userRoutes')
const authRoutes = require('./Controllers/authRoutes')
//middleware
app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.get('/', (req, res)=>{res.send('hellooooo')})
app.use(cors())
app.use(express.json())

app.listen(port, ()=>{
    console.log('server is running on port', port)
})

module.exports = app