var http = require('http');
var net = require('net');
var crypto = require('crypto');

var bind_port    = 24374;
var bind_address = '127.0.0.1';

function growl_notify(msg) {
	var app_sha = crypto.createHash('sha1');
	app_sha.update('Git Postcommit');
	var app_id = app_sha.digest('hex');

	var app_name = 'Git Postcommit';

	var msg_sha = crypto.createHash('sha1');
	msg_sha.update(msg);
	var hash = msg_sha.digest('hex');

	var growl_register = net.connect(23053, function() {
		var gntp = '';
		gntp += 'GNTP/1.0 REGISTER NONE\r\n';
		gntp += 'Application-Name: ' + app_name + '\r\n';
		gntp += 'X-Application-ID: ' + app_id + '\r\n';
		gntp += 'Notifications-Count: 1\r\n';

		gntp += '\r\n';

		gntp += 'Notification-Name: New Push\r\n';
		gntp += 'Notification-Display-Name: New Push\r\n';
		gntp += 'Notification-Enabled: True\r\n';

		gntp += '\r\n';

		gntp += 'Identifier: ' + hash + '\r\n';
		gntp += 'Length: ' + msg.length + '\r\n';

		gntp += msg;

		gntp += '\r\n';

		growl_register.write(gntp);
	});

	growl_register.on('data', function(data) {
		growl_register.end();
	});

	growl_register.on('close', function() {
		var growl_notify = net.connect(23053, function() {
			var gntp = '';
			gntp += 'GNTP/1.0 NOTIFY NONE\r\n';
			gntp += 'Application-Name: ' + app_name + '\r\n';
			gntp += 'Notification-Name: New Push\r\n';
			gntp += 'Notification-Title: ' + msg + '\r\n';

			gntp += '\r\n';

			growl_notify.write(gntp);
		});

		growl_notify.on('data', function(data) {
			console.log('Notified growl.');
			growl_notify.end();
		});
	});
}

http.createServer(function(request, response) {
	var url = require('url').parse(request.url, true);

	var msg = '';
	if ( typeof url.query.msg !== 'undefined' ) {
		msg = url.query.msg;
	}

	console.log('Received message: ' + msg);

	// Notify developers via Growl that an update has been pushed.
	growl_notify(msg);

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end(msg + '\n');
}).listen(bind_port, bind_address);

console.log('Listening on ' + bind_address + ':' + bind_port);