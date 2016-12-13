/* =-=-=-=-=-=-=-=-=-= 此文件是链接 redisCluster 的配置文件 =-=-=-=-=-=-=-=-=-=-= */
var Log = require('./log');
var Redis = require('ioredis');
var Config = require('./config');
var cluster = new Redis.Cluster(Config.redisClusterOptions);
cluster.on("connect", function () {
    Log.info('redis 集群链接 SUCCESS!');
});
cluster.on("error", function (err) {
    if (err) throw 'redisCluster.js =:|=====> ' + err;
});
module.exports = cluster;