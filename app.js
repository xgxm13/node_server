const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const moment = require('moment')
// 全局挂载 cors  解决跨域
app.use(cors())
// parse application/x-www-form-urlencoded
// 当extended 为false  值为数组或者字符串  为true时 值可以为任何类型
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const jwtConfig = require('./jwt_config')
const { expressjwt:jwt } = require('express-jwt')
app.use(jwt({
  secret: jwtConfig.jwtSecretKey, algorithms:['HS256']
}).unless({
  path: [/^\/api\//]
}))
const loginRouter = require('./router/login')
app.use('/api', loginRouter)


app.listen(port, ()=> {
  console.log(`Example app listening on port ${port}`)
})