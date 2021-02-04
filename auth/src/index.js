const express = require('express')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(body_parser.json())

app.get('*', (req, res) => {
    res.send('Hello')
})

app.listen(4000, () => {
    console.log('Service(Auth) listening on port 4000...')
})
