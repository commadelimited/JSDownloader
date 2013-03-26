
/*
 * GET home page.
 */
exports.index = function(req, res){
    var response = {
        msg: ''
    };
    res.render('index', response);
};