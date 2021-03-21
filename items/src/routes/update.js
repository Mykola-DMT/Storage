const express = require('express')
const { body, validationResult } = require('express-validator')
const Item = require('../models/item')
const { currentUser } = require('@mdticketss/common')

const router = express.Router()

router.put('/:itemId', currentUser, [
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

    const existed = await Item.findById(req.params.itemId)

    if (!existed) {
        return res.status(404).send({
            errors: [{ message: 'Not found' }]
        })
    }

    if (existed.userId !== req.currentUser.id) {
        return res.status(401).send({
            errors: [{ message: 'Not authorized' }]
        })
    }

    const { name, size, price, isSold } = req.body

    let date = null
    if (existed.isSold === false && isSold) {
        var today = new Date()
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    }

    existed.set({
        name, size, price, date, isSold
    })
    await existed.save()

    res.send(existed)
})

module.exports = router