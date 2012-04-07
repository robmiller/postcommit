jQuery(function($) {
	var socket = io.connect('http://postcommit:24375');

	socket.on('commit', function(commit) {
		console.log(commit);

		var markup = '';
		markup += '<li>';
		markup += '<p class="commit-time">' + commit.time + '</p>';
		markup += '<p class="commit-message">' + commit.message + '</p>';
		markup += '<p class="commit-meta">';
		markup += '<span class="author">by ' + commit.author + '</span> ';
		markup += '<span class="project">on ' + commit.project + '</span></p>';
		markup += '</li>'

		$(markup)
			.css({display: 'none'})
			.appendTo($('#commits'))
			.fadeIn(1000);
	});
});