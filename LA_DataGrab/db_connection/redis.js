/* =-=-=-=-=-=-=-=-=-= 此文件是链接 redis 的配置文件 =-=-=-=-=-=-=-=-=-=-= */
var Log = require('./log');
var redis = require('redis');
var Config = require('./config');
var redisClient = redis.createClient({
    'host': Config.redisHost,
    'port': Config.redisPort
});
redisClient.on("error", function (err) {
    Log.error("Error " + err);
    redisClient.quit();
});
redisClient.on("connect", function () {
    Log.info('redis 数据库链接 SUCCESS!');
});
module.exports = redisClient;