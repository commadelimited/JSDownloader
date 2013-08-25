var redis = require('redis');

if (process.env.VCAP_SERVICES) {
    ENVIRONMENT = 'prod';
} else {
    ENVIRONMENT = 'dev';
}

/**
 * Creates authorized redis client, ready for working
 *
 * return {object}
 */
var getAuthorizedClient = function() {
    if (ENVIRONMENT === 'prod') {
        var service_type = "redis-2.2",
            json = JSON.parse(process.env.VCAP_SERVICES),
            credentials = json[service_type][0]["credentials"],
            client = redis.createClient(credentials.port, credentials.host);
        client.auth(credentials.password);
        return client;
    } else {
        return redis.createClient();
    }
};

/*
 * GET home page.
 */
exports.downloads = function(req, res){
    var client = getAuthorizedClient(),
        response = {};
    // retrieve recently downloaded URLs
    client.lrange("recentdownloads", 0 , 10, function(err, downloads) {
        response.downloads = downloads.reverse();
        res.send(response);
        res.end();
    });
};