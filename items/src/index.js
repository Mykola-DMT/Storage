const mongoose = require('mongoose')
const app = require('./app')
const natsWrapper = require('./natsWrapper')

const start = async () => {
    if (!process.env.jwt_key) {
        return res.status(400).send({
            errors: [{ message: 'JWT must be defined' }]
        })
    }
    if (!process.env.MONGO_URI) {
        return res.status(400).send({
            errors: [{ message: 'Mongo_URI must be defined' }]
        })
    }

    try {

        await natsWrapper.connect('storage', 'items', 'http://nats-srv:4222')

        natsWrapper.client.on('close', () => {
            console.log('NATS connectuon closed')
            process.exit()
        })

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to mongoDb');

    } catch (err) {
        console.log(err)
    }

    app.listen(3000, () => {
        console.log('Listening(Items) on 3000...');
    })
}

start()