const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/', (req, res) => {
    if(!req.session?.jwt){
        return res.send({ currentUser: null })
    }

    try{
        const payload = jwt.verify(req.session.jwt, process.env.jwt_key)
        res.send({ currentUser: payload })
    }catch (err){
        res.send({ currentUser: null })
    }
})

module.exports = router