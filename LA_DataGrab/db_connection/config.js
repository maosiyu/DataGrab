/**
 * Created by mao-siyu on 16-11-14.
 */
var Config = function () {
};
// mysql config
Config.mysqlDatabase = 'dlfc';
Config.mysqlHost = '10.32.156.159';
Config.mysqlPort = '3306';
Config.mysqlUser = 'dlfc';
Config.mysqlPassword = '6npoa6l6';
// redis config
Config.redisHost = '10.32.156.156';
Config.redisPort = '6379';
// 资源文件路径
Config.resourceUrl = 'https://www.housecenter.cn/';
// 服务器url地址
Config.serverUrl = '10.32.156.156:8080';
// Log输入级别
// ERROR:4、WARN:3、INFO:2、DEBUG:1
Config.logType = 2;
module.exports = Config;