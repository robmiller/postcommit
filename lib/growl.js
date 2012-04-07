var net = require('net');
var crypto = require('crypto');

var app_sha = crypto.createHash('sha1');
app_sha.update('Git Postcommit');
var app_id = app_sha.digest('hex');

var app_name = 'Git Postcommit';

exports.notify = function(msg) {
	var msg_sha = crypto.createHash('sha1');
	msg_sha.update(msg);
	var hash = msg_sha.digest('hex');

	register(function() {
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

function register(callback) {
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

		growl_register.write(gntp);
	});

	growl_register.on('data', function(data) {
		growl_register.end();
	});

	growl_register.on('close', callback);
}