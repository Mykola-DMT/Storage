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
    var today = new Date()
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

    const items = await Item.find({ userId: req.currentUser.id, date })//.sort({ isSold: 1 })

    let total = 0
    for (i = 0; i < items.length; i++) {
        total += items[i].price
    }
    console.log(total)

    resp = {
        totalToday: total, items
    }

    res.send(resp)
})


module.exports = router