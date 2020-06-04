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
	// [[sock.id, nickname]]
	let socketNicknames = []; 
	// [[room, nr]]
	let nrOfSocketsRoom = [];
	// [[room, nr]]
	let confirmedGameStart = [];


function startGame(enterGameId) {

	console.log("<game> started in room: ", enterGameId);

	// get clientId in gam room
	io.in(enterGameId).clients((err, clients) => {

		if (err) {
			console.error('<ERROR> ', err);
		}

		console.log("clients: ", clients);

		// clientIds to nickname for play.js
		let players = [];

		for (let i = 0; i < socketNicknames.length; i++) {

			if (socketNicknames[i][0] == clients[0] || socketNicknames[i][0] == clients[1]) {

				players.push(socketNicknames[i][1]);

			}

		}

		console.log("players: ", players);

		// "send" confirm game start alert
		io.in(enterGameId).emit('startGame', players, enterGameId);

	});

}


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

			console.log("<possibleId> ", possibleId);

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

		nrOfSocketsRoom.push([newCustomGameId, 1]);

	});


	// on sock send join method enterGameId and nickname => join room and start game
	sock.on("enterGameId", (enterGameId, nickname) => {

		// console.log(enterGameId, nickname);

		// code validation variables
		let validGameId = false;
		let validRoom = false;

		// check wether code is in gameIds
		for (let i = 0; i < gameIds.length; i++) {

			// if it is mark validGameId as true and break
			if (gameIds[i] == enterGameId) {

				validGameId = true;

				break;

			}
		
		}

		// check wether room is full
		for (let i = 0; i < nrOfSocketsRoom.length; i++) {

			//  if not
			if (nrOfSocketsRoom[i][0] == enterGameId && nrOfSocketsRoom[i][1] == 1) {

				// "make room full"
				nrOfSocketsRoom[i][1] = 2;

				validRoom = true;

				break;

			}

		}

		// if code is valid join and "start" game
		if (validGameId == true && validRoom == true) {

			// push nickname (with sock.id) to socketNicknames
			socketNicknames.push([sock.id, nickname]);

			// join socket to room
			sock.join(enterGameId);

			startGame(enterGameId);

		// else
		} else if (validGameId == false || validRoom == false) {

			sock.emit("roomFullInvalid", enterGameId);

		}

	});


	sock.on('confirmStart', (gameId) => {

		// console.log(gameId);

		let gameIsInConfirmedStartArray = false;

		// go through confirmedGameStart to check wether game room was already added
		for (var i = 0; i < confirmedGameStart.length; i++) {

			// it was added gameIsInConfirmedStartArray = true to skip adding in following if statement
			if (confirmedGameStart[i][0] == gameId) {

				gameIsInConfirmedStartArray = true;

				break;

			}
		}

		// it game room wasnt added already, add it to gameIsInConfirmedStartArray
		if (gameIsInConfirmedStartArray == false) {

			confirmedGameStart.push([gameId, 0]);

		}

		let confirmed = false;

		// console.log("<confirmed> false = ", confirmed)

		// confirmed = true if second client confirmes otherwise save first confirmation
		for (var i = 0; i < confirmedGameStart.length; i++) {
			if (confirmedGameStart[i][0] == gameId && confirmedGameStart[i][1] == 0) {

				confirmedGameStart[i][1] = 1;

			} else if (confirmedGameStart[i][0] == gameId && confirmedGameStart[i][1] == 1) {

				confirmedGameStart[i][1] = 2;

				confirmed = true;

				console.log("<confirmed> ", confirmed)

			}
		}

		// if borth clients conirmed send showGame to both clients to start game
		if (confirmed == true) {

			io.in(gameId).emit('showGame');

		}

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