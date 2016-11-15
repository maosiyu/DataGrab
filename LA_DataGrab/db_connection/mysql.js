/* =-=-=-=-=-=-=-=-=-= 此文件是链接 mysql 的配置文件 =-=-=-=-=-=-=-=-=-=-= */
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
var Config = require('./config');
var mysql = require('mysql');
var pool;
// 将属性添加到当前对象(这样其它js文件就可以访问到了)

if (pool)
    return;
/**g ggit
 * 配置连接池
 */
pool = mysql.createPool({
    database: Config.mysqlDatabase,
    host: Config.mysqlHost,
    port: Config.mysqlPort,
    user: Config.mysqlUser,
    password: Config.mysqlPassword
});

// 链接数据库
pool.getConnection(function (err, connection) {
    if (err)
        throw  'mysql 数据库链接 FAIL! \n' + err;
    console.log('mysql 数据库链接 SUCCESS!');
    connection.release();
});

/**
 * 注册连接池事件
 */
emitter.on('connection', function (sql, callback) {
    pool.getConnection(function (err, connection) {
        connection.query(sql, function (err, rows) {
            // 释放连接
            connection.release();
            callback(err, rows);
        });
    });
});

var query = function (sql, callback) {
    emitter.emit('connection', sql, callback);
};

module.exports = query;