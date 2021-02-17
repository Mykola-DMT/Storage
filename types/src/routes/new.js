const express = require('express')
const {currentUser} = require('@mdticketss/common')
const {body, validationResult} = require('express-validator')
const Type = require('../models/type')

const router = express.Router()

router.post('/', currentUser, [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required')
],
async (req, res) => {
    
    if(!req.currentUser){
        return res.status(401).send({
            errors: [{message: 'Not authorized'}]
        })
    }
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).send({
            errors: errors.array().map(error => {
                return { message: error.msg, field: error.param}
            })
        })
    }

    const {title} = req.body

    const type = new Type({
        title,
        userId: req.currentUser.id
    })

    await type.save()

    res.status(201).send(type)
})

module.exports = router