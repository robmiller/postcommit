var http = require('http');
var net = require('net');

var messaging_port    = 24374;
var messaging_address = '127.0.0.1';

http.createServer(function(request, response) {
	var crypto = require('crypto');
	var growl = require('./lib/growl.js');

	var url = require('url').parse(request.url, true);

	var message = '';
	if ( typeof url.query.message !== 'undefined' ) {
		message = url.query.message;
	}

	var author = '';
	if ( typeof url.query.author !== 'undefined' ) {
		author = url.query.author;
	}

	var time = '';
	if ( typeof url.query.author !== 'undefined' ) {
		time = url.query.time;
	}

	var project = '';
	if ( typeof url.query.project !== 'undefined' ) {
		project = url.query.project;
	}

	console.log('Received message: ' + message + ' by ' + author);

	var update = {
		message: message,
		author: author,
		time: time,
		project: project
	}

	// Notify developers via Growl that an update has been pushed.
	growl.notify(message);

	// Notify streaming clients about the update
	io.sockets.emit('commit', update);
	console.log('Notified streaming clients.');

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end(message + '\n');
}).listen(messaging_port, messaging_address);

console.log('Listening for messages on ' + messaging_address + ':' + messaging_port);

var streaming_port    = 24375;
var streaming_address = '127.0.0.1';

var io = require('socket.io').listen(streaming_port);

io.sockets.on('connection', function(socket) {
	 socket.emit('bonjour', {message: 'why hello there'});
});

console.log('Streaming on ' + streaming_address + ':' + streaming_port);