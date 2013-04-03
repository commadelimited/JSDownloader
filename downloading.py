import requests
import pyquery
import string
import random
from urlparse import urlparse


class Downloading(object):
    fullurl = ''
    url_bits = ''
    domain = ''  # = [url_bits.protocol,'//',url_bits.hostname].join('');

    def __init__(self, url=None):
        self.fullurl = self.validate_url(url)
        import pdb;pdb.set_trace()
        pass

    def random_string(length):
        chars = string.ascii_lowercase
        txt = u''.join(random.choice(chars) for _ in range(length))
        return txt

    def validate_url(self, url):
        explode = urlparse(url)

        # make sure the URL is valid
        if explode.netloc:
            self.url_bits = explode

        if self.url_bits.netloc == 'jsfiddle.net':
            return self.url_bits.geturl() + '/show/'
        elif self.url_bits.netloc == 'jsbin.com':
            return self.url_bits.geturl()[0:-4]




# /* fiddles to test
#     http://jsfiddle.net/commadelimited/SA45t/2/
#     http://jsfiddle.net/odigity/zS5uu/
#     http://jsfiddle.net/phillpafford/wvVmT/2/
#     http://jsfiddle.net/mT76T/17/
#     http://jsfiddle.net/jonathansampson/3y4hz/3/
# */

#     $ = require('cheerio'),
#     url = require('url'),
#     fs = require('fs'),
#     pw = require('password-generator'),
#     request = require('request'),
#     zip = require('node-zip'),
#     baseDir = '/tmp/';

# getSourceUrl = function(url) {
#     return url + 'show/';
# };

# getFileList = function(type, $html, domain) {
#     var obj = {
#             raw: [],
#             final: []
#         },
#         options = {
#             js: {
#                 find: 'script[src]',
#                 attr: 'src'
#             },
#             css: {
#                 find: 'link[href]',
#                 attr: 'href'
#             }
#         };

#     obj.final = $html.find(options[type].find).map(function(i, el) {
#         var file = $(this).attr(options[type].attr);
#         obj.raw.push(file);
#         return prepFileUrl(file, domain);
#     }).join(',').split(',');

#     return obj;
# };

# prepFileUrl = function(url, domain) {
#     var finalUrl;
#     if (url.substring(0,2) === '//') {
#         finalUrl = ['http:',url].join('');
#     } else if (url.substring(0,1) === '/') {
#         finalUrl = [domain,url].join('');
#     } else {
#         finalUrl = url;
#     }
#     return finalUrl;
# };

# processRemoteFiles = function(arr, dir) {
#     arr.forEach(function(file){
#         var filename = fileNameFromUrl(file);
#         downloadFile(dir, file, filename);
#     });
# };

# fileNameFromUrl = function(file) {
#     return file.split('/').reverse()[0];
# };

# downloadFile = function(dir, remotefile, name) {
#     request(remotefile).pipe(fs.createWriteStream(dir + name));
#     // console.log('creating ' + name);
# };

# writeZip = function(dir,name) {
#     // // adm-zip version
#     // var zip = new AdmZip(),
#     //     filename = ['jsd-',name,'.zip'].join(''),
#     //     ls = fs.readdirSync(dir);

#     // ls.forEach(function(file){
#     //     zip.addLocalFile(dir + file);
#     // });

#     // zip.writeZip(baseDir + filename);


#     // node zip version
#     // var zip = new JSZip(),
#     //     filename = ['jsd-',name,'.zip'].join(''),
#     //     ls = fs.readdirSync(dir);
#     // zip.file('test.txt', 'hello there');
#     // var data = zip.generate({base64:false,compression:'DEFLATE'});
#     // fs.writeFileSync('test.zip', data, 'binary');
# };

# rewritePaths = function($html, jsArr, cssArr) {
#     // loop over js, replace with relative references
#     var html = $html.toString();
#     jsArr.forEach(function(file){
#         var filename = fileNameFromUrl(file);
#         html = html.replace(file, 'js/' + filename);
#         // console.log(file, filename);
#     });
#     cssArr.forEach(function(file){
#         var filename = fileNameFromUrl(file);
#         html = html.replace(file, 'css/' + filename);
#         // console.log(file, filename);
#     });
#     return html;
# };

# exports.download = function(req, res){
#     var response = {
#         msg: 'Now downloading from ' + req.body.source_url
#     },
#     fullurl = getSourceUrl(req.body.source_url),
#     url_bits = url.parse(fullurl),
#     domain = [url_bits.protocol,'//',url_bits.hostname].join('');

#     http.get(fullurl, function(res) {
#         res.on('data', function (chunk) {
#             var $source = $(''+chunk),
#                 js = getFileList('js', $source, domain),
#                 css = getFileList('css', $source, domain),
#                 uniqueName = pw(),
#                 dir = [baseDir,'jsd-', uniqueName, '/'].join(''),
#                 jsdir = dir + 'js/',
#                 cssdir = dir + 'css/',
#                 html = rewritePaths($source, js.raw, css.raw);

#             // create tmp, js, and css directories
#             fs.mkdirSync(dir);

#             // save index file
#             fs.writeFileSync(dir + 'index.html', html);

#             // Save JS files
#             processRemoteFiles(js.final, dir);

#             // Save CSS files
#             processRemoteFiles(css.final, dir);

#             // write zip file to /tmp
#             writeZip(dir,uniqueName);

#         });
#     }).on('error', function(e) {
#         console.log("Got error: " + e.message);
#     });

#     res.render('index', response);
# };


