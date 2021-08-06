const mysql = require('mysql');
const CONFIG = require('../config/conf')

var mysqlConnection = mysql.createConnection({
    host: CONFIG.db_host,
    user: CONFIG.db_user,
    password: CONFIG.db_password,
    database: CONFIG.db_name,
    multipleStatements: true
});


module.exports =  mysqlConnection;