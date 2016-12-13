var Log = require('./db_connection/log');
var fs = require('fs');
// 时间格式化
var moment = require('moment');
// 监听Node程序退出
process.on('exit', function (code) {
    Log.info('程序在:===>' + moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') + ' 时停止工作!');
});
// 监听Node程序中所有未处理的异常
process.on("uncaughtException", function (err) {
    err = 'ErrorMessage: ' + err + '\n' + 'ErrorDate   : ' + moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    Log.error('============================================= BEGIN ==========================================================');
    Log.error(err);
    // 以追加的方式 将文件写到硬盘的当前目录
    fs.appendFile('NodeErrorLog.txt', err + '\n\n', function (err) {
    });
    Log.error('============================================== END ===========================================================\n');
});

// 初始化模块
require('./routes/index');