// 抓取首页
var Bagpipe = require('bagpipe');
var util = require('./utils.js');
var schedule = require('node-schedule');
var Log = require('../db_connection/log');
var Config = require('../db_connection/config');
var redisClient = require('../db_connection/redis');

// 如何每隔 15 分钟、 30 分钟执行一次任务呢？
// 比较关键的地方在于 rule.minute 是支持数组的，知道这一点就很好操作了
// 每隔 15 分钟执行：
// 代码如下:
//     rule.minute = [0, 15, 45];
// 同理，每隔 30 分钟执行：
// 代码如下:
//     rule.minute = [0, 30];
var rule = new schedule.RecurrenceRule();
rule.minute = [];
for (var i = 0; i < 60; i++) {
    if (i % 5 === 0)
        rule.minute.push(i);
}
var j = schedule.scheduleJob(rule, function () {
    loadData();
});

var loadData = function () {
    var targetUrls = [{url: Config.serverUrl, name: 'https://www.housecenter.cn/'}];
    /**
     * 下载
     * @param targetUrls [{url: 'http://', name: ''}, {url: 'https://', name: ''}]
     * @param downLoadType 以哪种方式生成 例如: 使用Redis: redisWriteFile, 使用本地流:localWriteFile
     * @param replacRuleHandle 替换规则函数对象(这是个回调函数)
     */
    util.load(targetUrls, 'redisWriteFile', replacRuleHandle);
}

/**
 * 正则表达式替换规则自处理器
 * @param err
 * @param data 传入数据
 */
var replacRuleHandle = function (data) {

    if (!data)
        throw 'data 不存在！';

    var ruleContent = Config.resourceUrl;
    return data.replace(/src="\//g, 'src="' + ruleContent)
        .replace(/href="\//g, 'href="' + ruleContent)
        .replace(/background:url\(\//g, 'background:url(' + ruleContent);
}
Log.info('首页 模块加载成功!');