var logger = require('./logger.js');
var rawdeflate = require('./rawdeflate.js');
var logger = require('./logger.js');
var base64 = require('./base64.js');


function compress(data) {
    return base64.Base64.toBase64(rawdeflate.RawDeflate.deflate(base64.Base64.utob(data)));
}

function sendInvalidParameters(res, query) {
    var serializedError = JSON.stringify({ 'errorCode': 401, 'errorMessage': 'Invalid Parameters.' });
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(query && query.compress == 'false' ? serializedError : compress(serializedError));
    res.end();
    logger.log(logger.LEVEL.ERROR, 'SEND_INVALID_PARAMETERS', "Invalid Parameters", { request_url: res.url, query: query });
}

// only takes query to turn on/off compression
function sendResponse(response, json, query) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    if (query && query.compress == 'false') {
        response.writeHead(200, { "Content-Type": "application/javascript" });
        response.write(json);
    } else {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(compress(json));
    }
    logger.log(logger.LEVEL.INFO, 'SEND_RESPONSE', "Response sent", { request_url: response.url, response: json });
    response.end();

}

/**
 * Sends an error response.
 * @param res Response object to write to
 * @param err Error that has occurred
 * @param [query] Request query
 */
function sendError(res, err, query) {
    if (!res) { return; }



    const errorString = err.toString instanceof Function ? err.toString() : 'Error on callback: ';
    logger.log(logger.LEVEL.ERROR, 'SEND_ERROR', errorString, { err, query, request_url: res.url });

    var errObj = {
        errorCode: 500,
        errorMessage: 'An unknown error has occurred. We will be looking into this right away.'
    };
    var errorJson = JSON.stringify(errObj);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(query && query.compress == 'false' ? errorJson : compress(errorJson));
    res.end();
}

function authUser(response, query, callback) {
    var userID = query['userid'];
    var auth = query['auth'];
    var cpid = query['cpid'];

    // if userid or auth aren't specified in the query, it will fail
    if (!userID || !auth || !cpid) {
        sendAuthenticationFailed(response, query);
        return;
    }

    // database.query('call userAuthenticate(?,?,?)', [userID, auth, cpid])
    //     .then(rows => {
    //         // if credentials are correct, db returns true and this returns true
    //         if (rows[0][0]) {
    //             logger.log(logger.LEVEL.DEBUG, 'AUTH_USER', "Authentication successful", {});
    //             callback(rows[0][0]);
    //         } else {
    //             sendAuthenticationFailed(response, query);
    //         }
    //     });
}

function sendAuthenticationFailed(res, query) {
    var serializedError = JSON.stringify({ 'errorCode': 402, 'errorMessage': 'Authentication Failed.' });
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(query && query.compress == 'false' ? serializedError : compress(serializedError));
    res.end();
    logger.log(logger.LEVEL.WARN, 'SEND_AUTH_FAILED', "Authentication failed", { request_url: res.url, query: query });
}

exports.sendInvalidParameters = sendInvalidParameters;
exports.sendResponse = sendResponse;
exports.sendError = sendError;
exports.authUser = authUser;
exports.sendAuthenticationFailed = sendAuthenticationFailed;