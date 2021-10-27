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
    
    // let count = 10000; // 10s
    // socket.on('question-load', ()=>{
    //     io.sockets.emit('timer', count);
    // })
    // socket.on('reset', () => {
    //     io.sockets.emit('timer', count);
    // })

    socket.on('join-room', (room, str, email) => {
        socket.join(room)
        let number = io.sockets.adapter.rooms.get(room).size

        io.in(room).emit('joined', str, number, email)
        //cb(`Joined ${room}`)
    })

    socket.on('disconnecting', () => {

        const roomName = [...socket.rooms].pop()
        let guests = io.sockets.adapter.rooms.get(roomName).size-1
        io.in(roomName).emit('userLeft', guests)
    })

    socket.on('send-questions', (room, questions) => {
        socket.to(room).emit('questions', questions)
    })

    socket.on('send-scores', (room, score) => {
        socket.to(room).emit('receive-questions', score)
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