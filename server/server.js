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


// 'global' (all sockets) variables 
	let gameIds = [];
	// [[sock.id, nickname]]
	let socketNicknames = []; 
	// [[room, nr]]
	let nrOfSocketsRoom = [];
	// [[room, nr]]
	let confirmedGameStart = [];


function startGame(enterGameId) {

	console.log('<game> started in room: ', enterGameId);

	// get clientId in gam room
	io.in(enterGameId).clients((err, clients) => {

		if (err) {
			console.error('<ERROR> ', err);
		}

		console.log('clients: ', clients);

		// clientIds to nickname for play.js
		let players = [];

		for (let i = 0; i < socketNicknames.length; i++) {

			if (socketNicknames[i][0] == clients[0] || socketNicknames[i][0] == clients[1]) {

				players.push(socketNicknames[i][1]);

			}

		}

		console.log('players: ', players);

		// 'send' confirm game start alert
		io.in(enterGameId).emit('startGame', players, enterGameId);

	});

}


// gameData = [
// 			[gameId, [millisecondsLastCheck, millisecondsToAdjust, ticksCalculated], [food]]
// 			]
let gameData = [];
let food = [];

const minX = 0
const maxX = 1920

const minY = 0
const maxY = 1080

const tick = 1000/60;


function generateInitialGameState(gameId) {

	// generate food
	food = [];
	const initFoodCount = 250;

	for (let i = 0; i < initFoodCount; i++){

		let possibleNewFood = [
								Math.floor(Math.random() * (maxX - minX + 1) + minX),
								Math.floor(Math.random() * (maxY - minY + 1) + minY),
								Math.floor(Math.random() * (7 - 1 + 1) + 1),
								Math.floor(Math.random() * (7 - 1 + 1) + 1)
								]

		while (possibleNewFood[2] == 7 && possibleNewFood[3] == 7) {

			possibleNewFood[2] = Math.floor(Math.random() * (7 - 1 + 1) + 1);
			possibleNewFood[3] = Math.floor(Math.random() * (7 - 1 + 1) + 1);

		}

		if (possibleNewFood[2] > 3) {

			possibleNewFood[2] -= 7;

		}

		if (possibleNewFood[3] > 3) {

			possibleNewFood[3] -= 7;

		}

		food.push(possibleNewFood);

	}


	// push to gameData
	for (let i = 0; i < gameData.length; i++){

		if (gameData[i][0] == gameId) {

			// set 'tick presicing' info
			gameData[i][1] = [Date.now(), 0, 0];

			gameData[i][2] = food;

		}

	}

}


function updateFood(gameId) {

	let newFood = [];

	for (let i = 0; i < gameData.length; i++){

		if (gameData[i][0] == gameId) {

			let oldFood = gameData[i][2];

			for (let i = 0; i < oldFood.length; i ++) {

				let oldX = oldFood[i][0];
				let oldY = oldFood[i][1];

				let velX = oldFood[i][2];
				let velY = oldFood[i][3];

				let newX = oldX + velX;
				let newY = oldY + velY;

				if (newX < minX || newX > maxX) {
					velX = -velX;
				}

				if (newY < minY || newY > maxY) {
					velY = -velY;
				}

				newFood.push([newX, newY, velX, velY])

			}

			gameData[i][2] = newFood;

		}

	}

}


function updateGame(gameId) {

	// console.log('<' + gameId + '> calculating');

	let ticksToDo = 0;

	for (let i = 0; i < gameData.length; i++){

		if (gameData[i][0] == gameId) {

			let millisecondsNow = Date.now();
			// console.log('millisecondsNow: ' + millisecondsNow);

			let millisecondsLastCheck = gameData[i][1][0];
			// console.log('millisecondsLastCheck: ' + millisecondsLastCheck);

			gameData[i][1][0] = Date.now();

			let millisecondsToAdjust =  gameData[i][1][1];
			// console.log('millisecondsToAdjust: ' + millisecondsToAdjust);

			let millisecondsPassed = millisecondsNow - millisecondsLastCheck;
			// console.log('millisecondsPassed: ' + millisecondsPassed);

			millisecondsPassed += millisecondsToAdjust;

			// console.log('millisecondsPassed + millisecondsToAdjust: ' + millisecondsPassed);

			ticksToDo = Math.floor(millisecondsPassed / tick);

			// set new millisecondsToAdjust
			gameData[i][1][1] = millisecondsPassed - ticksToDo * tick;
			// console.log('millisecondsToAdjust: ' + gameData[i][1][1]);

			// add ticksCalculated to counter
			gameData[i][1][2] += ticksToDo;

		}

	}


	// console.log('ticksToDo: ' + ticksToDo);

	for (let ticksDone = 0; ticksDone < ticksToDo; ticksDone++) {

		updateFood(gameId);

		// console.log('ticksDone: ' + ticksDone);

	}

	for (let i = 0; i < gameData.length; i++){

		if (gameData[i][0] == gameId) {

			io.in(gameId).emit('updateGame', gameData[i]);

		}

	}

}


// server connection event listener
io.on('connection', (sock) => {

	console.log('<connection> New connection: ', sock.id);

	// on sock send join method createGameId and nickname => setup new room
	sock.on('createGameId', (nickname) => {

		console.log('<connection> sock.id: ', sock.id, '; nickname: ', nickname);

		// push nickname (with sock.id) to socketNicknames
		socketNicknames.push([sock.id, nickname]);

		// console.log('socketNicknames: ', socketNicknames);

		console.log('<gameIds> old:', gameIds);

		// create newCustomGameId variable
		let newCustomGameId = null;

		// create possibleId variable
		let possibleId = Math.random().toString().slice(2, 10);

		// go through loop until newCustomGameId is set
		while (newCustomGameId == null) {

			console.log('<possibleId> ', possibleId);

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

		console.log('<gameIds> new:', gameIds);

		// send newCustomGameId to sock
		sock.emit('newCustomGameId', newCustomGameId);

		// join sock to room
		sock.join(newCustomGameId);

		nrOfSocketsRoom.push([newCustomGameId, 1]);

	});


	// on sock send join method enterGameId and nickname => join room and start game
	sock.on('enterGameId', (enterGameId, nickname) => {

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

				// 'make room full'
				nrOfSocketsRoom[i][1] = 2;

				validRoom = true;

				break;

			}

		}

		// if code is valid join and 'start' game
		if (validGameId == true && validRoom == true) {

			// push nickname (with sock.id) to socketNicknames
			socketNicknames.push([sock.id, nickname]);

			// join socket to room
			sock.join(enterGameId);

			startGame(enterGameId);

		// else
		} else if (validGameId == false || validRoom == false) {

			sock.emit('roomFullInvalid', enterGameId);

		}

	});


	sock.on('confirmStart', (gameId) => {

		// console.log(gameId);

		let gameIsInConfirmedStartArray = false;

		// go through confirmedGameStart to check wether game room was already added
		for (let i = 0; i < confirmedGameStart.length; i++) {

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

		// console.log('<confirmed> false = ', confirmed)

		// confirmed = true if second client confirmes otherwise save first confirmation
		for (let i = 0; i < confirmedGameStart.length; i++) {
			if (confirmedGameStart[i][0] == gameId && confirmedGameStart[i][1] == 0) {

				confirmedGameStart[i][1] = 1;

			} else if (confirmedGameStart[i][0] == gameId && confirmedGameStart[i][1] == 1) {

				confirmedGameStart[i][1] = 2;

				confirmed = true;

				console.log('<confirmed> ', confirmed)

			}
		}

		// if both clients conirmed send showGame to both clients to start game
		if (confirmed == true) {

			io.in(gameId).emit('showGame');

			gameData.push([gameId, food]);

			generateInitialGameState(gameId);

			// start game calculating
			setInterval(updateGame, 1000/60, gameId);

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