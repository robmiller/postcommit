jQuery(function($) {
	var socket = io.connect('http://postcommit:24375');

	socket.on('commit', function(data) {
		console.log(data);

		$('<li>' + data.message + '</li>')
			.css({display: 'none'})
			.appendTo($('#commits'))
			.fadeIn('slow');
	});
});