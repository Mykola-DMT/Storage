const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const cookieSession = require('cookie-session')
const {NotFoundError, errorHandler} = require('@mdticketss/common')

const app = express()
app.use(body_parser.json())

app.set('trust proxy', true)
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)
app.use(errorHandler)

app.use('/api/users/signup', require('./routes/signup'))
app.use('/api/users/signin', require('./routes/signin'))
app.use('/api/users/currentuser', require('./routes/current-user'))
app.use('/api/users/signout', require('./routes/signout'))

app.all('*', (req, res) => {
    res.status(404).send({errors: [{message: 'Not found'}]})
    //throw new NotFoundError()
})


module.exports = app