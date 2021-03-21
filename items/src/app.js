const express = require('express')
//const 'express-async-errors')
const { json } = require('body-parser')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const { currentUser } = require('@mdticketss/common')

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)

app.use(currentUser)

app.use('/api/items', require('./routes/new'))
app.use('/api/items', require('./routes/show'))
app.use('/api/items', require('./routes/index'))
app.use('/api/items', require('./routes/update'))

app.all('*', (req, res) => {
    res.status(404).send({errors: [{message: 'Not found'}]})
})

module.exports = app