const express = require('express')
const router = express.Router()

const expressJoi = require('@escook/express-joi')
const { login_limit } = require('../limit/login')
const { register, login } = require('../router_handle/login')

router.post('/register', expressJoi(login_limit), register)
router.post('/login', expressJoi(login_limit), login)

module.exports = router