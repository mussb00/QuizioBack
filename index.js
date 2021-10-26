const app = require('./server')
const mongoose = require('mongoose')


app.listen(process.env.PORT || 3000, () => console.log('server is running'))