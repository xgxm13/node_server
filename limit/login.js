const joi = require('joi')
// string 只能为字符串
// alphanum a-z A-Z 0-9
// min 最小长度 max 最大长度
// required 必填
// pattern 正则
const name = joi.string().alphanum().min(2).max(12).required()
const password = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()
const sex = joi.string()
exports.login_limit = {
  // 对req.body 校验
  body: {
    name,
    password,
    sex
  }
}