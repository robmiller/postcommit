jQuery(function($) {
	var socket = io.connect('http://postcommit:24375');

	socket.on('push', function(push) {
		console.log(push);

		var markup = '';
		markup += '<li class="commit">';
		markup += '<p class="push-time">' + push.time + '</p>';
		markup += '<p class="push-message">' + push.message + '</p>';
		markup += '<p class="push-meta">';
		markup += '<span class="author">by ' + push.author + '</span> ';
		markup += '<span class="project">on ' + push.project + '</span></p>';
		markup += '</li>'

		$(markup)
			.css({display: 'none'})
			.appendTo($('#stream'))
			.fadeIn(1000);
	});

	socket.on('review-request', function(request) {
		console.log(request);

		var markup = '';
		markup += '<li class="review-request">';
		markup += '<p>' + request.author + ' wants review on ' + request.project + ':</p>';
		if ( request.message.length > 0 ) {
			markup += '<p>' + request.message + '</p>';
		}
		markup += '</li>';

		$(markup)
			.css({display: 'none'})
			.appendTo($('#stream'))
			.fadeIn(1000);
	});
});