const {server} = require('./server')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000

server.listen(port, () => console.log('server is running'))