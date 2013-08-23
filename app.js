
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    download = require('./routes/download'),
    recent = require('./routes/recent'),
    http = require('http'),
    path = require('path'),
    app = express(),
    server, io, socket, messages = [];

global.sendMessage = function (name, data) {
    if (socket) {
        socket.emit(name, data);
    } else {
        messages.push([name, data]);
    }
};

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/download', download.download);
app.use('/serve', express.static(__dirname + '/tmp'));
app.use('/recent', recent.downloads);

server = http.createServer(app).listen(app.get('port'), function(){
    // console.log("Listening on port " + app.get('port'));
});

io = require('socket.io').listen(server);
io.configure('production', function(){
    io.set('transports', ['xhr-polling']);
});
io.sockets.on('connection', function (s) {
    socket = s;
    for (var i = 0; i < messages.length; i++) {
        socket.emit(messages[i][0], messages[i][1]);
    }
});