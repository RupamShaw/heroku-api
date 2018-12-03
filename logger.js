var moment = require('moment');
var tz = require('moment-timezone');

var LOG_TEMPLATE = '$TIME [$LEVEL] [$FUNC] "$MESSAGE"$PARAMS';
var LEVEL = {
    ERROR : 0,
    WARN : 1,
    INFO : 2,
    DEBUG : 3,
    DEBUG2 : 4
}
var SET_LEVEL = LEVEL.DEBUG;

function log(level, func, message, params = {}) {
    if (level > SET_LEVEL) { return; }

    // mask passwords (and store them to unmask after logging)
    var passParams = {};
    if (params.query) {
        for (var key in params.query) {
            if(!Object.hasOwnProperty.call(params.query, key)) continue;
            if (['pass', 'pword', 'password', 'newpass', 'oldpass','userPassword'].indexOf(key) > -1)  {
                passParams[key] = params.query[key];
                params.query[key] = '****';
            }
        }
    }

    var logline = LOG_TEMPLATE.replace(
            '$TIME', moment().tz('Australia/Sydney').format("DD/MM/YY HH:mm:ss.SSS")).replace(
            '$LEVEL', levelToString(level)).replace(
            '$FUNC', func).replace(
            '$MESSAGE', message).replace(
            '$PARAMS', paramsToString(params));
    console.log(logline);

    // unmask passwords
    for (var key in passParams) {
        if(!Object.hasOwnProperty.call(passParams, key)) continue;
        params.query[key] = passParams[key];
    }
}

function levelToString(level) {
    switch (level) {
    case LEVEL.ERROR:
        return 'ERROR';
    case LEVEL.WARN:
        return 'WARN';
    case LEVEL.INFO:
        return 'INFO';
    case LEVEL.DEBUG:
        return 'DEBUG';
    default:
        return 'DEBUG2';
    }
}

function paramsToString(params) {
    var str = '';
    for(var key in params) {
        var paramTemplate = ' $KEY($VALUE)';
        var value = typeof(params[key]) == 'object' ? JSON.stringify(params[key]) : params[key];;
        str += paramTemplate.replace(
                '$KEY', key).replace(
                '$VALUE', value);
    }
    return str;
}

exports.log = log;
exports.LEVEL = LEVEL;
