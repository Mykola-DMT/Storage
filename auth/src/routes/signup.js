const express = require('express')
const { body } = require('express-validator')
const {signup} = require('../controllers/signupController') 

const router = express.Router()

router.post('/', 
[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
    .trim()
    .isLength({ min :4, max: 20 })
    .withMessage('Password between 4 and 20 characters')
],
signup)

router.get('/', (req, res) => {
    res.send('work')
})

signupRouter = router
module.exports = signupRouter
//export {router as signupRouter}