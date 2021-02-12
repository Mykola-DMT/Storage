const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

exports.signin = async function(req, res){

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).send({
            errors: errors.array().map(error => {
                return { message: error.msg, field: error.param}
            })
        })
    }

    const {email, password} = req.body

    const existingUser = await User.findOne({email})
    if(!existingUser){
        return res.status(400).send({
            errors: [{message: 'Invalid credentials'}]
        })
    }

    const isMatch = await bcrypt.compare(password, existingUser.password)
    if(!isMatch){
        return res.status(400).send({
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