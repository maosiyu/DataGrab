// 抓取首页
var fs = require('fs');
var path = require('path');
var Bagpipe = require('bagpipe');
var superagent = require('superagent');

/**
 * 向本地写文件
 * @param fileName 要生成的文件名
 * @param fileContent 要生成的文件内容
 */
var writeFile = function (fileName, fileContent) {

    // 将文件写到硬盘
    fs.writeFile(path.join(__dirname, fileName), fileContent, function (err) {
        if (err) throw err;
        console.info("fileName: " + fileName + " Export Account Success!");
    });
}

/**
 *
 * @param url 抓取的页面地址
 * @param htmlName 要生成的文件名
 * @param callback 回调函数
 */
var downLoadHtml = function (url, htmlName, callback) {
    superagent.get(url).end(function (err, res) {
        callback(null, htmlName, replacRuleHandle(res.text));
    });
}

/**
 * 正则表达式替换规则自处理器
 * @param err
 * @param data 传入数据
 */
var replacRuleHandle = function (data) {

    if (!data)
        throw 'data 不存在！';

    var ruleContent = 'https://www.housecenter.cn/';

    return data.replace(/src="\//g, 'src="' + ruleContent)
        .replace(/href="\//g, 'href="' + ruleContent)
        .replace(/background:url\(\//g, 'background:url(' + ruleContent);
}


var targetUrls = [
    'https://www.housecenter.cn',
    'https://www.housecenter.cn'];
// 最大并发数为20 + 超时控制
var bagpipe = new Bagpipe(20, {
    timeout: 9000
});
for (var i = 0; i < targetUrls.length; i++) {
    bagpipe.push(downLoadHtml, targetUrls[i], i, function (err, htmlName, resultData) {
        // 异步回调执行
        if (err) {
            console.error(err);
            return;
        }

        writeFile('../downLoad/' + htmlName + '.html', resultData);
        //
        //     var newText = callback.text;
        //     newText = newText.replace(/src="\//g, 'src="https://www.housecenter.cn/');
        //     newText = newText.replace(/href="\//g, 'href="https://www.housecenter.cn/');
        //     newText = newText.replace(/background:url\(\//g, 'background:url(https://www.housecenter.cn/');
        //
        //     // 将文件写到硬盘
        //     fs.writeFile(path.join(__dirname, './housecenter' + htmlName + '.html'), newText, function (err) {
        //         if (err) throw err;
        //         console.log("htmlName: " + htmlName + " Export Account Success!");
        //     });
    });
}
;
