const express = require('express')
const Type = require('../models/type')
const { body,validationResult } = require('express-validator')
const {currentUser} = require('@mdticketss/common')

const router = express.Router()

router.put('/:id', currentUser,
    [
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

        const type = await Type.findById(req.params.id)

        if (!type) {
            return res.status(404).send({
                errors: [{message: 'Not found'}]
            })
        }

        if (type.userId !== req.currentUser.id) {
            return res.status(401).send({
                errors: [{message: 'Not authorized'}]
            })
        }

        type.set({
            title: req.body.title
        })
        await type.save()

        res.send(type)
    })

module.exports = router