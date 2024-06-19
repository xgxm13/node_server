const express = require('express')
const router = express.Router()
const loginHandle = require('../router_handle/login')

router.post('/register', loginHandle.register)
router.post('/login', loginHandle.login)

module.exports = router