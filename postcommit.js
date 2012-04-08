// There are two servers at work here; the first handles receiving messages...
var messaging_port    = 24374;
var messaging_address = '127.0.0.1';

var messaging = require('express').createServer();
messaging.listen(messaging_port, messaging_address);
console.log('Listening for messages on ' + messaging_address + ':' + messaging_port);

// ...and the second pushes messages out to clients.
var streaming_port    = 24375;
var streaming_address = '127.0.0.1';

var io = require('socket.io').listen(streaming_port);
console.log('Streaming on ' + streaming_address + ':' + streaming_port);

// We need to set up some routes for the messaging server.
messaging.get('/', function(request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('ping? pong!');
});

// The main guts of the app is /message, which receives messages and pushes 
// them to the streaming server.
messaging.get('/message', function(request, response) {
	var url = require('url').parse(request.url, true);

	type = 'push';

	var update = {};

	["type", "message", "author", "time", "project"].forEach(function(key) {
		if ( typeof url.query[key] !== 'undefined' ) {
			update[key] = url.query[key];
		} else {
			update[key] = '';
		}
	});

	console.log(update);

	type = update.type;

	// Notify streaming clients about the update
	io.sockets.emit(type, update);
	console.log('Notified streaming clients.');

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Message posted.\n');
});

// Handle submission of messages from the frontend
io.sockets.on('connection', function(socket) {
	socket.on('chat', function(data) {
		console.log('Received message from frontend: ' + data);
		io.sockets.emit('chat', data);
	});
});