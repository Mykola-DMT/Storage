const express = require('express')
const Item = require('../models/item')
const { currentUser } = require('@mdticketss/common')

const router = express.Router()

router.get('/:itemId', currentUser, async (req, res) => {
    if (!req.currentUser) {
        return res.status(401).send({
            errors: [{ message: 'Not authorized' }]
        })
    }

    const item = await Item.findById(req.params.itemId)

    if (!item) {
        return res.status(404).send({ errors: [{ message: 'Not found' }] })
    }

    res.send(item)
})

module.exports = router