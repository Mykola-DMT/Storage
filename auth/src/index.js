const express = require('express')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const axios = require('axios')
const cookieSession = require('cookie-session')



const app = express()
app.use(body_parser.json())

app.set('trust proxy', true)
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
)

app.use('/api/users/signup', require('./routes/signup'))
app.use('/api/users/signin', require('./routes/signin'))
app.use('/api/users/currentuser', require('./routes/current-user'))
app.use('/api/users/signout', require('./routes/signout'))

app.all('*', (req, res) => {
    res.status(404).json({errors: [{message: 'Not found'}]})
})

const start = async () => {
    if(!process.env.jwt_key){
        throw new Error('JWT must be defined')
    }
    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to mongoDb');
        
    } catch(err){
        console.log(err)
    }

    app.listen(4000, () => {
        console.log('Service(Auth) listening on port 4000...')
    })
}

start()