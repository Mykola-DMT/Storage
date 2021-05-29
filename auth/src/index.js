const mongoose = require('mongoose')
const app = require('./app')

const start = async () => {
    console.log('Starting up...')
    if (!process.env.jwt_key) {
        throw new Error('JWT must be defined')
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to mongoDb');

    } catch (err) {
        console.log(err)
    }

    app.listen(4000, () => {
        console.log('Service(Auth) listening on port 4000...')
    })
}

start()