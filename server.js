const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv');
app.use(cors())
app.use(express.json())

const userRoutes = require('./Controllers/userRoutes')
const authRoutes = require('./Controllers/authRoutes')
const {verifyToken} = require('./Middleware/auth')

const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3001']
    }
})

io.on('connection', socket => {
   console.log(socket.id)

    socket.on('join-room', (room, id) => {
        socket.join(room)

        socket.to(room).emit('joined', id, room)
        //cb(`Joined ${room}`)
    })
})

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