/**
 *
 * Allows users to download an HTML page and remote JS/CSS resources
 *
 */

var http = require('http'),
    $ = require('cheerio'),
    url = require('url'),
    fs = require('fs'),
    pw = require('password-generator'),
    request = require('request'),
    async = require('async'),
    archiver = require('archiver'),

    baseDir = 'tmp/';

/**
 * Given a valid URL, returns the correct URL for either JSFiddle or JSBin.
 *
 * @param {url} valid URL
 * return {string}
 */
getSourceUrl = function(url) {

    if (url.indexOf('jsfiddle') > -1) {
        return url + 'show/';
    } else if (url.indexOf('jsbin') > -1) {
        return url + '/quiet';
    } else if (url.indexOf('codepen') > -1) {
        // incoming: http://codepen.io/katmai7/pen/cDtIo
        // outgoing: http://codepen.io/katmai7/fullpage/cDtIo
        return url.replace('/pen/','/fullpage/');
    } else {
        return url;
    }
};

/**
 * Reverses a string in place
 *
 * @param {str} a string
 * return {string}
 */
reverse = function(str) {
    return str.split('').reverse().join('');
};

/**
 * Extracts JS and CSS file names from HTML source
 *
 * @param {type} either js or css
 * @param {html} the full HTML as retrieved from the target URL
 * @param {domain} the TLD of the target URL
 * return {object}
 */
extractFileNames = function(type, html, domain) {
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

    obj.final = html.find(options[type].find).map(function(i, el) {
        var file = $(this).attr(options[type].attr);
        // we only want JS and CSS files right now
        if (file.match(/.js$/) || file.match(/.css$/)) {
            obj.raw.push(file);
            return prepFileUrl(file, domain);
        }
    }).join(',').split(',');

    if (!obj.raw.length) {
        obj.final.length = 0;
    }

    return obj;
};

/**
 * determines pathing for remote URL
 *
 * @param {url} a remote URL
 * @param {domain} the TLD of the target URL
 * return {string}
 */
prepFileUrl = function(url, domain) {
    var finalUrl;
    // protocol relative URL, pulls from domain external to that of
    // the original target URL.
    // http://paulirish.com/2010/the-protocol-relative-url/
    if (url.substring(0,2) === '//') {
        finalUrl = ['http:',url].join('');
    // root relative URL. Pulls from original target URL
    } else if (url.substring(0,1) === '/') {
        finalUrl = [domain,url].join('');
    // Begins with some standard protocol (http or https usually)
    } else {
        finalUrl = url;
    }
    return finalUrl;
};

/**
 * Loops over list of remote files. Prepares them for download
 *
 * @param {arr} an array of URLs to download
 * @param {domain} the target directory
 * return {void}
 */
processRemoteFiles = function(jsArr, cssArr, dir, name) {
    var contactArr = jsArr.concat(cssArr);

    async.forEach(contactArr,function(url, cb){
        var filename = url.split('/').reverse()[0];
        if (url !== '') {
            download(dir + filename, url, function(err,result){
                //handle error here
                cb();
            });
        }
    },function(e){
        sendMessage('done', e);
        // kick off zip creation
        writeZip(dir, name);
    });
};

/**
 * Packages local files into a ZIP archive
 *
 * @param {dir} directory of source files.
 * @param {name} the zip archive file name
 * return {void}
 */
writeZip = function(dir,name) {
    var zipName = baseDir + "jsd-" + name + ".zip",
        fileArray = getDirectoryList(dir),
        output = fs.createWriteStream(zipName),
        archive = archiver('zip');

    archive.pipe(output);

    fileArray.forEach(function(item){
        var file = item.path + item.name;
        archive.append(fs.createReadStream(file), { name: item.name });
    });

    archive.finalize(function(err, written) {
      if (err) {
        console.log('--------------------------');
        console.log(err);
        throw err;
      }

      console.log(written + ' total bytes written');
    });

};

/**
 * Returns array of file names from specified directory
 *
 * @param {dir} directory of source files.
 * return {array}
 */
getDirectoryList = function(dir){
    var fileArray = [],
        files = fs.readdirSync(dir);
    files.forEach(function(file){
        var obj = {name: file, path: dir};
        fileArray.push(obj);
    });
    return fileArray;
};

/**
 * Extracts file name from a URL
 *
 * @param {file} the URL of a remote file
 * return {string}
 */
fileNameFromUrl = function(file) {
    return file.split('/').reverse()[0];
};

/**
 * Downloads a remote file to the local file system
 *
 * @param {localFile} where the file will be downloaded to
 * @param {remotePath} the URL of a remote file
 * @param {callback} what does this do?
 * return {void}
 */
download = function(localFile, remotePath, callback) {

    var localStream = fs.createWriteStream(localFile);

    var out = request({ uri: remotePath });
    out.on('response', function (resp) {
        if (resp.statusCode === 200){
            out.pipe(localStream);
            localStream.on('close', function () {
                sendMessage('fileDone', {
                    name: localFile,
                    success: true
                });
                callback(null, localFile);
            });
        } else {
            sendMessage('fileDone', {
                name: localFile,
                success: false
            });
            callback(new Error("No file found at given url."),null);
        }
    });
};

/**
 * Packages local files into a ZIP archive
 *
 * @param {html} source html
 * @param {jsArr} Array of javascript file URLs
 * @param {cssArr} Array of css file URLs
 * return {void}
 */
rewritePaths = function(html, jsArr, cssArr) {
    // loop over js, replace with relative references
    var local_html = html.toString(),
        local_arr = jsArr.concat(cssArr);

    local_arr.forEach(function(file){
        var filename = fileNameFromUrl(file);
        local_html = local_html.replace(file, filename);
    });

    return local_html;
};

/**
 * Packages local files into a ZIP archive
 *
 * @param {html} source html
 * @param {jsArr} Array of javascript file URLs
 * @param {cssArr} Array of css file URLs
 * return {void}
 */
exports.download = function(req, res){
    var response = {
        msg: 'Now downloading from ' + req.body.source_url
    },
    fullurl = getSourceUrl(req.body.source_url),
    urlBits = url.parse(fullurl),
    domain = [urlBits.protocol,'//',urlBits.hostname].join('');

    http.get(fullurl, function(response) {
        var fullResponse = [];

        response
        .on('data', function (chunk) {
            // buffer entire HTML page before running the balace of the app
            fullResponse.push(''+chunk);

        }).on('error', function(err){

            // return error message
            response.msg = err.message;

        }).on('end', function(data){

            var $source = $(fullResponse.join('').toString()),
                js = extractFileNames('js', $source, domain),
                css = extractFileNames('css', $source, domain),
                uniqueName = pw(),
                dir = [baseDir,'jsd-', uniqueName, '/'].join(''),
                jsdir = dir + 'js/',
                cssdir = dir + 'css/',
                html = rewritePaths($source, js.raw, css.raw);

            // create temporary directory
            fs.mkdirSync(dir);

            // save index file
            fs.writeFileSync(dir + 'index.html', html);

            // Save JS and CSS files
            processRemoteFiles(js.final, css.final, dir, uniqueName);

        });
    }).on('error', function(err) {
        // return error message
        response.msg = err.message;
        sendMessage('done', err);
    });

    res.render('index', response);
};


