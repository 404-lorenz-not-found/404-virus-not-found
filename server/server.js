// importing modules
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

// on connection
const app = express();

// static files
const clientPath = `${__dirname}/../client`;

	console.log(`<server> serving static from ${clientPath}`);

// serving static files
app.use(express.static(clientPath));

// server
const server = http.createServer(app);

// socket.io server to client
const io = socketio(server);


// "global" (all sockets) variables 
let gameIds = [];
let socketNicknames = [];


// server connection event listener
io.on('connection', (sock) => {

	console.log('<connection> New connection: ', sock.id);

	// on sock send join method createGameId and nickname => setup new room
	sock.on("createGameId", (nickname) => {

		console.log('<connection> sock.id: ', sock.id, "; nickname: ", nickname);

		// push nickname (with sock.id) to socketNicknames
		socketNicknames.push([sock.id, nickname]);

		// console.log("socketNicknames: ", socketNicknames);

		console.log("<gameIds> old:", gameIds);

		// create newCustomGameId variable
		let newCustomGameId = null;

		// create possibleId variable
		let possibleId = Math.random().toString().slice(2, 10);

		// go through loop until newCustomGameId is set
		while (newCustomGameId == null) {

			console.log("possibleId: ", possibleId);

			// create idIsUsed to check wether possibleId is used alreade in gameIds after checking the gameIds array in the following loop
			let idIsUsed = false;

			for (let i = 0; i < gameIds.length; i++) {

				if (gameIds[i] == possibleId) {

					// as possibleId is used alreade try another one
					possibleId = Math.random().toString().slice(2, 10);

					// set idIsUsed to true to restart the loop without setting newCustomGameId
					idIsUsed = true;

					// break loop as possibleId can only be once in gameIds
					break;

				}

			}

			// set newCustomGameId if possibleId is not used and push it to gameIds
			if (idIsUsed == false) {
				
				newCustomGameId = possibleId;

				gameIds.push(possibleId);

			}

		}

		console.log("<gameIds> new:", gameIds);

		// send newCustomGameId to sock
		sock.emit('newCustomGameId', newCustomGameId);

		// join sock to room
		sock.join(newCustomGameId);

	});


});

// server error event listener
server.on('error', (err) => {
	console.error('<ERROR> ', err);
});

// server listener
server.listen(80, () => {
	console.log('<server> server started');
});