// import modules
	const http = require('http');
	const express = require('express');
	const socketio = require('socket.io');

	const lobby = require('./lobby_modules/lobby');


// server setup
	// on connection
		const app = express();

	// static files
		const clientPath = `${__dirname}/../client`;

		console.log('<server> serving static files from: ' + clientPath);

		// serving static files
			app.use(express.static(clientPath)); 

	// set server
		const server = http.createServer(app);

	// "connect socket.io to client"
		const io = socketio(server);


// on new connection
	io.on('connection', (sock) => {

		console.log('<connection> new connection with sock.id ' + sock.id);


		// call createGameId when client wants to create a custom room
			sock.on('createGameId', (nickname) => {
				lobby.createGameId(nickname, sock);
			});


		// call enterGameId when client wants to join a custom room
			sock.on('enterGameId', (enteredGameId, nickname) => {
				lobby.enterGameId(enteredGameId, nickname, sock, io);
			});


		// call startGame when client sends game start confirmation
			sock.on('startGame', (gameId) => {
				lobby.startGame(gameId, io);
			});

	});


// on server error
	server.on('error', (err) => {
		console.error('<error><server> ' + err);
	});


// server listen
	const port = 80;

	server.listen(port, () => {
		console.log('<server> started');
		console.log('<server> now listening on port ' + port);
	});