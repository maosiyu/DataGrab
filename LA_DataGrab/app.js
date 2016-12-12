var Log = require('./db_connection/log');
var fs = require('fs');
// 时间格式化
var moment = require('moment');
process.on('exit', function (code) {
    Log.info('程序在:===>' + moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') + ' 时停止工作!');
});
process.on("uncaughtException", function (err) {
    Log.error(err);
    // 以追加的方式 将文件写到硬盘的当前目录
    fs.appendFile('errorLog.txt', err + '\n\n', function (err) {

    });
});

// 初始化模块
require('./routes/index');