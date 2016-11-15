/**
 * Created by mao-siyu on 16-11-15.
 */
var Config = require('./config');
// ERROR:4、WARN:3、INFO:2、DEBUG:1
var LOG_TYPE = {
    ERROR: 4,
    WARN: 3,
    INFO: 2,
    DEBUG: 1
};
var LA_Log = function () {
};

LA_Log.error = function (message) {
    if (Config.logType <= LOG_TYPE.ERROR)
        console.error(message);
};

LA_Log.warn = function (message) {
    if (Config.logType <= LOG_TYPE.WARN)
        console.warn(message);
};

LA_Log.info = function (message) {
    if (Config.logType <= LOG_TYPE.INFO)
        console.info(message);
};

LA_Log.debug = function (message) {
    if (Config.logType <= LOG_TYPE.DEBUG)
        console.log(message);
};

module.exports = LA_Log;