const { validationResult } = require('express-validator')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signin = async function(req, res){
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array().map(error => {
                return { message: error.msg, field: error.param}
            })
        })
    }

    const {email, password} = req.body

    const existingUser = await User.findOne({email})
    if(!existingUser){
        res.status(400).json({
            errors: [{message: 'Invalid credentials'}]
        })
    }

    const isMatch = await bcrypt.compare(password, existingUser.password)
    if(!isMatch){
        res.status(400).json({
            errors: [{message: 'Invalid credentials'}]
        })
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
}