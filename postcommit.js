var http = require('http');
var net = require('net');
var crypto = require('crypto');
var growl = require('./growl.js');

var bind_port    = 24374;
var bind_address = '127.0.0.1';

http.createServer(function(request, response) {
	var url = require('url').parse(request.url, true);

	var msg = '';
	if ( typeof url.query.msg !== 'undefined' ) {
		msg = url.query.msg;
	}

	console.log('Received message: ' + msg);

	// Notify developers via Growl that an update has been pushed.
	growl.notify(msg);

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end(msg + '\n');
}).listen(bind_port, bind_address);

console.log('Listening on ' + bind_address + ':' + bind_port);