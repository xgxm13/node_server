const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const Joi = require('joi')
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

// 处理 Joi 验证错误的中间件  
app.use((err, req, res, next) => {
  if (err instanceof Joi.ValidationError) {
    return res.json({
      code: 400,
      msg: err.details.map(detail => detail.message)[0]
    });
  }
  next(err); // 如果不是 Joi 验证错误，则传递错误到下一个中间件  
});  

// 错误处理中间件  
app.use((err, req, res, next) => {
  // 发送错误信息作为响应体  
  res.json({
    code: err.status || 500,
    error: err.message,
  });
});

app.listen(port, ()=> {
  console.log(`Example app listening on port ${port}`)
})