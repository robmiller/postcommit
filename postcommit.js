var http = require('http');
var net = require('net');

var messaging_port    = 24374;
var messaging_address = '127.0.0.1';

http.createServer(function(request, response) {
	var url = require('url').parse(request.url, true);

	var update = {};

	["type", "message", "author", "time", "project"].forEach(function(key) {
		if ( typeof url.query[key] !== 'undefined' ) {
			update[key] = url.query[key];
		}
	});

	console.log(update);

	// Notify streaming clients about the update
	io.sockets.emit(type, update);
	console.log('Notified streaming clients.');

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Message posted.\n');
}).listen(messaging_port, messaging_address);

console.log('Listening for messages on ' + messaging_address + ':' + messaging_port);

var streaming_port    = 24375;
var streaming_address = '127.0.0.1';

var io = require('socket.io').listen(streaming_port);

io.sockets.on('connection', function(socket) {
	 socket.emit('bonjour', {message: 'why hello there'});
});

console.log('Streaming on ' + streaming_address + ':' + streaming_port);