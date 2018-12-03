var logger = require('./logger.js');
const {
    sendResponse,
    sendInvalidParameters
} = require('./responses.js');

var Users = [
    { user: 'rups', pass: '123456', success: 'true' },
    { user: 'shane', pass: 'password', success: 'true' }
];//user and pwd

function login(response, query) {
    if (!query.user || !query.pass) {
        sendInvalidParameters(response, query);
        return;
    }
    //    if (!query.platform) {
    //         query['platform'] = 'website'
    //     }
    const result = Users.filter(function (tempUser) {
        if (tempUser.user === query.user && tempUser.pass === query.pass) {
            return;
        }
    });
    console.log(result)
    if (result.length > 0) {
        sendResponse(response, JSON.stringify(tempUser), query);
    } else {
        sendResponse(response, "0", query);
        logger.log(logger.LEVEL.DEBUG, 'LOGIN', "Bad login - username not found, so can't compare passwords", {
            query: query
        });
    }
    //  return;
}
exports.login = login;