const express = require('express')
const { currentUser } = require('@mdticketss/common')
const { body, validationResult } = require('express-validator')
const natsWrapper = require('../natsWrapper')
const { Stan } = require('node-nats-streaming')
const Item = require('../models/item')
const Publisher = require('../events/publishers/publisher')

//jest.mock('../natsWrapper')

const router = express.Router()

router.post('/:typeId', currentUser, [
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

    const typeId = req.params.typeId
    const { name, size, price, isSold } = req.body
    let date = null
    if (isSold) {
        //date = Date.now()
        var today = new Date()
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    }

    const item = new Item({
        name, size, price, date, isSold, typeId,
        userId: req.currentUser.id
    })

    await item.save()

    // if (process.env.NODE_ENV !== 'test') {
    //     await natsWrapper.publish('item:created', {
    //         id: item.id,
    //         name: item.name,
    //         size: item.size,
    //         price: item.price,
    //         isSold: item.isSold,
    //         date: item.date,
    //         typeId: item.typeId,
    //         userId: item.userId
    //     })
    // }


    if (process.env.NODE_ENV !== 'test') {
        await new Publisher(natsWrapper.client).publish('item:created', {
            id: item.id,
            name: item.name,
            size: item.size,
            price: item.price,
            isSold: item.isSold,
            date: item.date,
            typeId: item.typeId,
            userId: item.userId
        })
    }



    res.status(201).send(item)
})

module.exports = router