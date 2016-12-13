// 抓取咨询
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

    var sql = "SELECT CONCAT('" + Config.resourceUrl + "view-', category_id,'-', id, '.html') AS name, CONCAT('" + Config.serverUrl + "/view-', category_id,'-', id, '.html') AS url FROM cms_article WHERE posid='1'  AND del_flag=0";
    mySqlQuery(sql, function (err, rows) {

        if (err) throw 'article.js --> mySqlQuery =:|=====> ' + err;

        Log.debug('咨询 共有 <' + rows.length + '> 条数据!');
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
        throw 'article.js --> replacRuleHandle =:|=====>  data 不存在！';

    var ruleContent = Config.resourceUrl;
    return data.replace(/src="\//g, 'src="' + ruleContent)
        .replace(/href="\//g, 'href="' + ruleContent)
        .replace(/background:url\(\//g, 'background:url(' + ruleContent);
}

Log.info('咨询 模块加载成功!');