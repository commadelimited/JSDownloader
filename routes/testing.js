var redis = require('redis');

if (process.env.VCAP_SERVICES) {
    ENVIRONMENT = 'prod';
} else {
    ENVIRONMENT = 'dev';
}

// VCAP_SERVICES environment variable
// {
//     "redis-2.2": [{
//         "name": "jsdownloader",
//         "label": "redis-2.2",
//         "plan": "free",
//         "tags": ["redis", "redis-2.2", "key-value", "nosql", "redis-2.2", "redis"],
//         "credentials": {
//             "hostname": "10.0.31.86",
//             "host": "10.0.31.86",
//             "port": 5123,
//             "password": "8b890150-2bb3-4a7f-b7ef-f8d5c239ed4d",
//             "name": "8144860e-31b1-4d4c-ace7-8db22081fa21"
//         }
//     }]
// }

/**
 * Retrieves redis credentials.
 *
 * @param {url} valid URL
 * return {object}
 */
var getAuthorizedClient = function() {
    if (ENVIRONMENT === 'prod') {
        console.log('remote');
        var service_type = "redis-2.2",
            json = JSON.parse(process.env.VCAP_SERVICES),
            credentials = json[service_type][0]["credentials"],
            client = redis.createClient(credentials.port, credentials.host);
        client.auth(credentials.password);
        return client;
    } else {
        console.log('local');
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
    var client = getAuthorizedClient();
    var downloadArr = [];

    // retrieve recently downloaded URLs
    client.lrange("recentdownloads", 0 , count, function(err, downloads) {
        console.log(downloads);
    });
};

/*
 * GET home page.
 */
exports.testing = function(req, res){
    var response = {
        vcap: process.env.VCAP_SERVICES,
        downloads: getRecentDownloads(10)
    };
    res.send(response);
    res.end();
};









































