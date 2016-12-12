/**
 * Created by mao_siyu on 2016/11/13.
 * 共通下载工具类
 * @param object 实现类的 类对象
 */

var fs = require('fs');
var path = require('path');
var Bagpipe = require('bagpipe');
var superagent = require('superagent');
var Log = require('../db_connection/log');
var redisClient = require('../db_connection/redis');

var Util = function () {
};

/**
 * 下载
 * @param targetUrls [{url: 'http://', name: ''}, {url: 'https://', name: ''}]
 * @param downLoadType 以哪种方式生成 例如: 使用Redis: redisWriteFile, 使用本地流:localWriteFile
 * @param replacRuleHandle 替换规则函数对象(这是个回调函数)
 */
Util.load = function (targetUrls, downLoadType, replacRuleHandle) {

    if (!targetUrls)
        throw 'Util.load =:|=====> targetUrls 不能为空！';
    if (!downLoadType)
        throw 'Util.load =:|=====> downLoadType 不能为空！';
    if (!replacRuleHandle)
        throw 'Util.load =:|=====> replacRuleHandle 不能为空！';

    // 最大并发数为500
    var bagpipe = new Bagpipe(50);
    for (var i = 0; i < targetUrls.length; i++) {
        if (!targetUrls[i]) throw 'Util.load =:|=====> targetUrls[' + i + ']';
        bagpipe.push(Util.downLoadHtml, targetUrls[i].url, targetUrls[i].name, downLoadType, replacRuleHandle, function (err, htmlName, downLoadType, resultData) {
            // 异步回调执行
            if (err) throw 'Util.load =:|=====> ' + err;
            // 生成的文件名, 要生成的文件内容
            Util[downLoadType](htmlName, resultData);
        });
    }
};

/**
 * 抓取页面 downLoadHtml
 * @param url 抓取的页面地址
 * @param htmlName 要生成的文件名
 * @param downLoadType 以哪种方式生成 例如: 使用Redis: redisWriteFile, 使用本地流:localWriteFile
 * @param replacRuleHandle 替换规则函数对象(这是个回调函数)
 * @param callback 回调函数
 */
Util.downLoadHtml = function (url, htmlName, downLoadType, replacRuleHandle, callback) {

    superagent.get(url).end(function (err, response) {
        if (err) throw 'Util.downLoadHtml =:|=====> ' + url + ' =:|=====> ' + err;
        if (!response)
            throw 'Util.downLoadHtml =:|=====> ' + url + ' =:|=====> response 没有数据！';
        callback(null, htmlName, downLoadType, replacRuleHandle(response.text));
    });
};

/**
 * 向本地写文件
 * @param fileName 要生成的文件名
 * @param fileContent 要生成的文件内容
 */
Util.localWriteFile = function (fileName, fileContent) {

    // 将文件写到硬盘
    fs.writeFile(path.join(__dirname, fileName), fileContent, function (err) {
        if (err) throw 'Util.localWriteFile =:|=====> ' + err;
        Log.debug("fileName: " + fileName + " Export Account Success!");
    });
};

/**
 * 向redis 数据库写文件
 * @param key
 * @param value
 * @param callback
 */
Util.redisWriteFile = function (key, value) {
    redisClient.set(key, value, function (err, reply) {
        if (err) throw 'Util.redisWriteFile =:|=====> ' + err;
        if (!reply)
            throw '向redis数据库写文件时返回值为: ' + reply;
        Log.debug(key + ' <===:-:===> ' + reply.toString());
    });
    // redisClient.get(key, function (err, reply) {
    //     console.log(reply.toString());
    // });
};

// 当使用require('./utils.js');时绑定的对象是 Util这个函数
module.exports = Util;