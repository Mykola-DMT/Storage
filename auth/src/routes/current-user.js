const express = require('express')
const {current_user} = require('../controllers/current-userController')
const {currentUser} = require('@mdticketss/common')

const router = express.Router()

router.get('/',currentUser, current_user)

module.exports = router