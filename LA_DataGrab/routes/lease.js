// 抓取房源详情
var Bagpipe = require('bagpipe');
var util = require('./utils.js');
var schedule = require('node-schedule');
var Log = require('../db_connection/log');
var Config = require('../db_connection/config');
var mySqlQuery = require('../db_connection/mysql');

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

    var sql = "SELECT CONCAT('" + Config.resourceUrl + "lease/info?id=', l.ID) AS name, CONCAT('" + Config.serverUrl + "/lease/info?id=', l.ID) AS 'url' FROM HOU_HOUSE_INFO H, HOU_LEASE_INFO L WHERE H.ID = L.HID AND L.RELEASE_STATUS = 1 AND L.AUDIT_STATUS <> 2 AND H.AUDIT_STATUS = 2 AND H.ACTIVE_STATUS = 1 AND H.LOCK_STATUS = 0 AND L.DELETE_FLG = 0 AND H.DELETE_FLG = 0";
    mySqlQuery(sql, function (err, rows) {

        if (err) throw 'lease.js --> mySqlQuery =:|=====> ' + err;

        Log.debug('房源 共有 <' + rows.length + '> 条数据!');
        /**
         * 下载
         * @param targetUrls [{url: 'http://', name: ''}, {url: 'https://', name: ''}]
         * @param downLoadType 以哪种方式生成 例如: 使用Redis: redisWriteFile, 使用本地流:localWriteFile
         * @param replacRuleHandle 替换规则函数对象(这是个回调函数)
         */
        util.load(rows, 'redisWriteFile', replacRuleHandle);
    });
}

/**
 * 正则表达式替换规则自处理器
 * @param err
 * @param data 传入数据
 */
var replacRuleHandle = function (data) {

    if (!data)
        throw 'lease.js --> replacRuleHandle =:|=====> data 不存在！';

    var ruleContent = Config.resourceUrl;
    return data.replace(/src="\//g, 'src="' + ruleContent)
        .replace(/href="\//g, 'href="' + ruleContent)
        .replace(/background:url\(\//g, 'background:url(' + ruleContent);
}

Log.info('房源 模块加载成功!');