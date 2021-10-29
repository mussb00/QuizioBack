const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv');
app.use(cors())
app.use(express.json())
const server = require('http').createServer(app)

const userRoutes = require('./Controllers/userRoutes')
const authRoutes = require('./Controllers/authRoutes')
const {verifyToken} = require('./Middleware/auth')


const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH']
    }
})

io.on('connection', socket => {
    
    socket.on('question-load', () => {
        let count = 10000;
        
        const timer = setInterval(() => {
            socket.emit('timer', count)
            count -= 100
            if (count === 0) {
                clearInterval(timer)
                socket.emit('next-question')
                
                
            }
        },100)
    })

    socket.on('send-emails', (room, emails) => {
        io.in(room).emit('emails', emails)
    })

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
app.get('/', (req, res)=>{res.send('Welcome to our Quiz API!')})
app.use(verifyToken)


//    moved this to index.js
//app.listen(port, ()=>{
//    console.log('server is running on port', port)
// })

module.exports = app