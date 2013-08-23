var redis = require('redis');

/**
 * Returns the x most recent downloaded URLs
 *
 * @param {count} how many to retrieve
 * return {array}
 */
getRecentDownloads = function(count){
    var client = redis.createClient(),
        downloadArr = [],
        recentDownloads = client.lrange("recentdownloads", 0 , count, function(err, downloads) {
            downloads.forEach(function(download, index){
                downloadArr.push(download);
            });
        });

    return downloadArr;
};

/*
 * GET home page.
 */
exports.downloads = function(req, res){
    var response = {
        downloads: getRecentDownloads(10)
    };

    res.send(response);
    res.end();
};