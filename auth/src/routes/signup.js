const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.post('/', 
[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
    .trim()
    .isLength({ min :4, max: 20 })
    .withMessage('Password between 4 and 20 characters')
],
async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
            message: 'Wrong login data'
        })
    }

    const {email, password} = req.body

    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({
            message:'This email is already registered.'
        })
    }

    const hashed = await bcrypt.hash(password,12)
    const user = new User({
        email, password: hashed
    })
    await user.save()

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.jwt_key)

    //Store on session object
    req.session = {
        jwt: userJwt
    }

    res.status(201).send(user)
})

router.get('/', (req, res) => {
    res.send('work')
})

signupRouter = router
module.exports = signupRouter
//export {router as signupRouter}