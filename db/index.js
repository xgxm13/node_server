const mysql = require('mysql2')
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'myapp'
})

module.exports = db