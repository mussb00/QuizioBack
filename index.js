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
   console.log(socket.id)

    socket.on('join-room', (room, str) => {
        socket.join(room)

        socket.to(room).emit('joined', str)
        //cb(`Joined ${room}`)
    })
})


const io = require('socket.io')(8080, {
    cors: {
        origin: ['http://localhost:3001']
    }
})

io.on('connection', socket => {
    
    let count = 10000; // 10s
    socket.on('question-load', ()=>{
        io.sockets.emit('timer', count);
    })
    socket.on('reset', () => {
        io.sockets.emit('timer', count);
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
