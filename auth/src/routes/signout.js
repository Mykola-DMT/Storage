const express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
    req.session = null

    res.send({})
})

module.exports = router