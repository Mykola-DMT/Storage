const express = require('express')
const Type = require('../models/type')
const Item = require('../models/item')
const { currentUser } = require('@mdticketss/common')

const router = express.Router()

router.get('/:id', currentUser, async (req, res) => {

    if (!req.currentUser) {
        return res.status(401).send({
            errors: [{ message: 'Not authorized' }]
        })
    }

    const type = await Type.findById(req.params.id).populate('items')
    const items = await Item.find({ typeId: req.params.id })

    if (!type) {
        return res.status(404).send({ errors: [{ message: 'Not found' }] })
    }

    const typeWithItems = {
        title: type.title,
        items: items
    }

    res.send(typeWithItems)
})

module.exports = router