const express = require('express')
const Item = require('../models/item')
const { currentUser } = require('@mdticketss/common')

const router = express.Router()

router.get('/', currentUser, async (req, res) => {
    if (!req.currentUser) {
        return res.status(401).send({
            errors: [{ message: 'Not authorized' }]
        })
    }

    const items = await Item.find({ userId: req.currentUser.id }).sort({ isSold: 1 })
    res.send(items)
})


module.exports = router