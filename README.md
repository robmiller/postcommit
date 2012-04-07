# postcommit

postcommit is a web-based activity stream for your Git repositories — or any other information you'd like to push out to your developers.

Whenever there's a new push to one of your Git repositories, the central server is sent details of the changes; it then pushes that information out to any interested clients, for whom it shows up as a new message in their activity stream.

## Requirements

The backend is built in node, and uses socket.io to communicate with clients; there are no other dependencies.

## Usage

To send a message to the server, simply request — e.g. via `curl` — a URL like the following:

	http://127.0.0.1:24374/?message=The+message+that+will+appear&author=Rob+Miller&time=2012-04-07+16:01:10&project=Some+Client+Project

This is most usefully done in a Git `post-update` hook, but can realistically be done from anywhere.