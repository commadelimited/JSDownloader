
/*
 * GET users listing.
 */

/* fiddles to test
    http://jsfiddle.net/commadelimited/SA45t/2/
    http://jsfiddle.net/odigity/zS5uu/
    http://jsfiddle.net/phillpafford/wvVmT/2/
    http://jsfiddle.net/mT76T/17/
    http://jsfiddle.net/jonathansampson/3y4hz/3/
*/

var http = require('http'),
    $ = require('cheerio'),
    url = require('url'),
    fs = require('fs'),
    pw = require('password-generator'),
    request = require('request'),
    async = require('async'),
    baseDir = '/tmp/';

getSourceUrl = function(url) {
    return url + 'show/';
};

extractFileNames = function(type, $html, domain) {
    var obj = {
            raw: [],
            final: []
        },
        options = {
            js: {
                find: 'script[src]',
                attr: 'src'
            },
            css: {
                find: 'link[href]',
                attr: 'href'
            }
        };

    obj.final = $html.find(options[type].find).map(function(i, el) {
        var file = $(this).attr(options[type].attr);
        obj.raw.push(file);
        return prepFileUrl(file, domain);
    }).join(',').split(',');

    return obj;
};

prepFileUrl = function(url, domain) {
    var finalUrl;
    if (url.substring(0,2) === '//') {
        finalUrl = ['http:',url].join('');
    } else if (url.substring(0,1) === '/') {
        finalUrl = [domain,url].join('');
    } else {
        finalUrl = url;
    }
    return finalUrl;
};

processRemoteFiles = function(arr, dir) {
    // arr.forEach(function(file){
    //     var filename = fileNameFromUrl(file);
    //     downloadFile(dir, file, filename);
    // });

    async.forEach(arr,function(url, cb){
        var filename = url.split('/').reverse()[0];
        download(dir + filename, url, function(err,result){
          //handle error here
          cb();
        });
    },function(e){
        console.log(e);
    });
};

fileNameFromUrl = function(file) {
    return file.split('/').reverse()[0];
};

download = function(localFile, remotePath, callback) {
    var localStream = fs.createWriteStream(localFile);

    var out = request({ uri: remotePath });
    out.on('response', function (resp) {
        if (resp.statusCode === 200){
            out.pipe(localStream);
            localStream.on('close', function () {
                callback(null, localFile);
            });
        } else {
            callback(new Error("No file found at given url."),null);
        }
    });
};

// downloadFile = function(dir, remotefile, name) {
//     request(remotefile).pipe(fs.createWriteStream(dir + name));
//     // console.log('creating ' + name);
// };

writeZip = function(dir,name) {

};

rewritePaths = function($html, jsArr, cssArr) {
    // loop over js, replace with relative references
    var html = $html.toString();
    jsArr.forEach(function(file){
        var filename = fileNameFromUrl(file);
        html = html.replace(file, 'js/' + filename);
        // console.log(file, filename);
    });
    cssArr.forEach(function(file){
        var filename = fileNameFromUrl(file);
        html = html.replace(file, 'css/' + filename);
        // console.log(file, filename);
    });
    return html;
};

exports.download = function(req, res){
    var response = {
        msg: 'Now downloading from ' + req.body.source_url
    },
    fullurl = getSourceUrl(req.body.source_url),
    urlBits = url.parse(fullurl),
    domain = [urlBits.protocol,'//',urlBits.hostname].join('');

    http.get(fullurl, function(res) {
        res.on('data', function (chunk) {
            var $source = $(''+chunk),
                js = extractFileNames('js', $source, domain),
                css = extractFileNames('css', $source, domain),
                uniqueName = pw(),
                dir = [baseDir,'jsd-', uniqueName, '/'].join(''),
                jsdir = dir + 'js/',
                cssdir = dir + 'css/',
                html = rewritePaths($source, js.raw, css.raw);

            // create tmp, js, and css directories
            fs.mkdirSync(dir);

            // save index file
            fs.writeFileSync(dir + 'index.html', html);

            // Save JS files
            processRemoteFiles(js.final, dir);

            // Save CSS files
            processRemoteFiles(css.final, dir);

            // write zip file to /tmp
            writeZip(dir,uniqueName);

        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });

    res.render('index', response);
};


