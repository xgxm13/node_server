const db = require('../db/index')
// 导入加密中间件
const bcrypt = require('bcryptjs')
// 导入jwt 用于生成token
const jwt = require('jsonwebtoken')
// 导入jwt配置文件 用于加密和解密
const jwtConfig = require('../jwt_config')
const moment = require('moment')


exports.register = (req, res) => {
  const reqInfo = req.body
  console.log(req.body);
  // 1、非空校验
  const { name, password } = reqInfo
  if (!name || !password) {
    return res.send({
      code: 500,
      msg: '用户名/密码不能为空！'
    })
  }
  // 2、判断name是否重复
  const sql = 'select * from t_users where name = ?'
  db.query(sql, name, (err, results)=> {
    if (results.length > 0) {
      return res.send({
        code: 500,
        msg: '账号已存在！'
      })
    }
    // 3、对密码进行加密
    // 需要使用加密中间件 bcrypt.js
    const password1 = bcrypt.hashSync(password, 10)
    // 4.把前端传来的数据插入到users表
    const sql1 = 'insert into t_users set ?'
    const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
    const obj = {
      ...reqInfo,
      password: password1,
      create_time,
    }
    db.query(sql1, obj, (err, results) => {
      if (err) {
        return res.send({
          code: 500,
          msg: '注册失败，请稍后再试！'
        })
      }
      // 影响的行数
      if (results.affectedRows !== 1) {
        return res.send({
          code: 500,
          msg: '注册失败，未知错误！'
        })
      }
      return res.send({
        code: 200,
        msg: '注册账号成功！'
      })
    })
  })
}

exports.login = (req, res, next) => {

  const loginInfo = req.body
  const { name, password } = loginInfo
  // 1、查询数据表中是否存在
  const sql = 'select * from t_users where name = ?'
  db.query(sql, name, (err, results) => {
    if (err) return next(err)
    // 
    if (results.length !== 1) {
      // 用户名不存在或密码错误，创建一个错误对象并传递给错误处理中间件  
      const error = new Error('登录失败！用户名不存在或密码错误');
      error.status = 401; // 设置 HTTP 状态码  
      return next(error);
    }
    // 对传来的password解密
    const compareResult = bcrypt.compareSync(password, results[0].password)
    if (!compareResult) {
      const error = new Error('登录失败！密码错误');
      return next(error);
    }
    // 账号是否冻结
    if (results[0].status == 1) {
      const error = new Error('登录失败！账号被冻结！');
      error.status = 403; // 设置 HTTP 状态码  
      return next(error);
    }
    // 生成token
    const userInfo = {
      ...results[0],
      password: '',
      avatar: '',
      create_time: '',
      update_time: ''
    }

    const tokenStr = jwt.sign(userInfo, jwtConfig.jwtSecretKey, {
      expiresIn: '7h'
    })
    res.send({
      // data: results[0],
      code: 200,
      msg: '登录成功！',
      token: `Bearer ${tokenStr}`
    })
  })
}