
const mysql = require('mysql2');

const db = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '',
  database: 'notification'
});

module.exports = db.promise();

