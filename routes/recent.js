var redis = require('redis');

/**
 * Retrieves redis credentials.
 *
 * @param {url} valid URL
 * return {object}
 */
var getClient = function() {
    if (process.env.VCAP_SERVICES) {
        var service_type = "redis-2.2",
            json = JSON.parse(process.env.VCAP_SERVICES),
            credentials = json[service_type][0]["credentials"];

        return redis.createClient(credentials["port"], credentials["host"]);
    } else {
        return redis.createClient();
    }
};

/**
 * Returns the x most recent downloaded URLs
 *
 * @param {count} how many to retrieve
 * return {array}
 */
getRecentDownloads = function(count){
    var client,
        downloadArr = [];

    // retrieve recently downloaded URLs
    client = getClient();
    client.lrange("recentdownloads", 0 , count, function(err, downloads) {
        return downloads;
    });
};

/*
 * GET home page.
 */
exports.downloads = function(req, res){
    var response = {
        downloads: getRecentDownloads(10)
        // downloads: ['http://jsfiddle.net/commadelimited/SA45t/2/',
        //             'http://jsfiddle.net/odigity/zS5uu/',
        //             'http://jsfiddle.net/mT76T/17/',
        //             'http://codepen.io/katmai7/pen/cDtIo',
        //             'http://jsbin.com/oxuyop/777']
    };

    res.send(response);
    res.end();
};