jQuery(function($) {
	var socket = io.connect('http://postcommit:24375');

	socket.on('push', function(push) {
		console.log(push);

		var markup = '';
		markup += '<li class="push">';
		markup += '<p class="push-time">' + push.time + '</p>';
		markup += '<p class="message">' + push.message + '</p>';
		markup += '<p class="push-meta">';
		markup += 'by <span class="author">' + push.author + '</span> ';
		markup += 'on <span class="project">' + push.project + '</span></p>';
		markup += '</li>'

		$(markup)
			.css({display: 'none'})
			.prependTo($('#stream'))
			.fadeIn(1000);
	});

	socket.on('review-request', function(request) {
		console.log(request);

		var markup = '';
		markup += '<li class="review-request">';
		markup += '<p><span class="author">' + request.author + '</span> wants review on ' + request.project + ':</p>';
		if ( request.message.length > 0 ) {
			markup += '<p class="message">' + request.message + '</p>';
		}
		markup += '</li>';

		$(markup)
			.css({display: 'none'})
			.prependTo($('#stream'))
			.fadeIn(1000);
	});

	socket.on('message', function(data) {
		console.log(data);
	});

	// Handle submission of messages from the frontend
	$('#message').submit(function() {
		socket.emit('message', {message: $('textarea.message').val()});
		return false;
	});
});