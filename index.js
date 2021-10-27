const app = require('./server')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000

app.listen(port, () => console.log('server is running'))