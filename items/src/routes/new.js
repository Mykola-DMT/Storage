const express = require('express')
const { currentUser } = require('@mdticketss/common')
const { body, validationResult } = require('express-validator')
const natsWrapper = require('../natsWrapper')
const { Stan } = require('node-nats-streaming')
const Item = require('../models/item')

const router = express.Router()

router.post('/', currentUser, [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    body('size')
        .not()
        .isEmpty()
        .custom((input) => input > 0)
        .withMessage('Size is required'),
    body('price')
        .not()
        .isEmpty()
        .custom((input) => input > 0)
        .withMessage('Price is required')

], async (req, res) => {

    if (!req.currentUser) {
        return res.status(401).send({
            errors: [{ message: 'Not authorized' }]
        })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array().map(error => {
                return { message: error.msg, field: error.param }
            })
        })
    }

    const { name, size, price, isSold } = req.body
    let date = null
    if (isSold) {
        date = Date.now()
    }

    const item = new Item({
        name, size, price, date, isSold,
        userId: req.currentUser.id
    })

    await item.save()

    // await natsWrapper.publish('type:created', {
    //     id: type.id,
    //     title: type.title,
    //     userId: type.userId
    // })


    // await new Publisher(natsWrapper.client).publish('type:created', {
    //     id: type.id,
    //     title: type.title,
    //     userId: type.userId
    // })



    res.status(201).send(item)
})

module.exports = router