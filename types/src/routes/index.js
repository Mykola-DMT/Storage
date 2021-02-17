const express = require('express')
const Type = require( '../models/type')
const {currentUser} = require('@mdticketss/common')

const router = express.Router()

router.get('/', currentUser, async (req, res) => {
    if(!req.currentUser){
        return res.status(401).send({errors: [{message: 'Not authorized'}]})
    }

    const types = await Type.find({})

    res.send(types)
})


module.exports = router