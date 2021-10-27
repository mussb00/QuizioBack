const app = require('./server')
const mongoose = require('mongoose')


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




app.use(verifyToken)


app.listen(process.env.PORT || 3000, () => console.log('server is running'))