const { validationResult } = require('express-validator')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signup = async function(req, res){
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
    if(existingUser){
        return res.status(400).send({
            errors: [{message: 'Email in use'}]
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
}