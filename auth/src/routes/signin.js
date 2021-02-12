const express = require('express')
const { body } = require('express-validator')
const {signin} = require('../controllers/signinController')
const {validationRequest} = require('@mdticketss/common')

const router = express.Router()

router.post('/', 
[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Enter password')
], 
signin)

router.get('/', (req, res) => {
    res.send('work')
})


module.exports = router