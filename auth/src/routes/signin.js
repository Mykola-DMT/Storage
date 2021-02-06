const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.post('/', 
[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Enter password')
],
async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
            message: 'Wrong signin data'
        })
    }

    const {email, password} = req.body

    const existingUser = await User.findOne({email})
    if(!existingUser){
        res.json({message:'Invaild credentials'})
    }

    const isMatch = await bcrypt.compare(password, existingUser.password)
    if(!isMatch){
        res.json({message:'Invaild credentials'})
    }


    
    //Generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.jwt_key)

    //Store on session object
    req.session = {
        jwt: userJwt
    }

    res.status(200).send(existingUser)
})
router.get('/', (req, res) => {
    res.send('work')
})


module.exports = router