/**
 *
 * Serves static ZIP files to users
 *
 */

var http = require('http');

/**
 * Serves static ZIP files to users
 */
exports.serveZip = function(req, res){
    console.log(req);
    console.log(res);
    // var response = {
    //     msg: 'Now downloading from ' + req.body.source_url
    // },
    // fullurl = getSourceUrl(req.body.source_url),
    // urlBits = url.parse(fullurl),
    // domain = [urlBits.protocol,'//',urlBits.hostname].join('');

    // http.get(fullurl, function(response) {
    //     var fullResponse = [];

    //     response
    //     .on('data', function (chunk) {
    //         // buffer entire HTML page before running the balace of the app
    //         fullResponse.push(''+chunk);

    //     }).on('error', function(err){

    //         // return error message
    //         response.msg = err.message;

    //     }).on('end', function(data){

    //         var $source = $(fullResponse.join('').toString()),
    //             js = extractFileNames('js', $source, domain),
    //             css = extractFileNames('css', $source, domain),
    //             uniqueName = pw(),
    //             dir = [baseDir,'jsd-', uniqueName, '/'].join(''),
    //             jsdir = dir + 'js/',
    //             cssdir = dir + 'css/',
    //             html = rewritePaths($source, js.raw, css.raw);

    //         // create temporary directory
    //         fs.mkdirSync(dir);

    //         // save index file
    //         fs.writeFileSync(dir + 'index.html', html);

    //         // Save JS and CSS files
    //         processRemoteFiles(js.final, css.final, dir, uniqueName);

    //     });
    // }).on('error', function(err) {
    //     // return error message
    //     response.msg = err.message;
    //     sendMessage('done', err);
    // });

    // res.render('index', response);
};

