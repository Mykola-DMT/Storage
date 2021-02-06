const express = require('express')
const {current_user} = require('../controllers/current-userController')

const router = express.Router()

router.get('/', current_user)

module.exports = router