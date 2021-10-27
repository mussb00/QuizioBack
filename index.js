const app = require('./server')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000


const {verifyToken} = require('./Middleware/auth')


mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true
}, () => {
    console.log('connected to database')
})


const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3001']
    }
})

io.on('connection', socket => {
    
    
    socket.on('question-load', (room) => {
        let count = 10000;
        const timer = setInterval(() => {
            socket.emit('timer', count)
            count -= 1000
            if (count === 0) {
                clearInterval(timer)
                socket.emit('next-question')
                
            }
        },1000)
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


app.use(verifyToken)


app.listen(process.env.PORT || 3000, () => console.log('server is running'))
