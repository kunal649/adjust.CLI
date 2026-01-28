const https = require('https');

module.exports = function redirectHandler(response, handleResponse) {
    if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, handleResponse);
        return true; 
    }
    return false; 
};