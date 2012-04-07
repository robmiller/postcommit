jQuery(function($) {
	var socket = io.connect('http://postcommit:24375');

	socket.on('push', function(push) {
		console.log(push);

		var markup = '';
		markup += '<li>';
		markup += '<p class="push-time">' + push.time + '</p>';
		markup += '<p class="push-message">' + push.message + '</p>';
		markup += '<p class="push-meta">';
		markup += '<span class="author">by ' + push.author + '</span> ';
		markup += '<span class="project">on ' + push.project + '</span></p>';
		markup += '</li>'

		$(markup)
			.css({display: 'none'})
			.appendTo($('#commits'))
			.fadeIn(1000);
	});
});