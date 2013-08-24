/*
 * GET home page.
 */
exports.testing = function(req, res){
    var response = {
        env: process.env
    };
    res.send(response);
    res.end();
};