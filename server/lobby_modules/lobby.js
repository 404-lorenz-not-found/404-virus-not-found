// import modules
	const sendConfirmAlert = require('./sendConfirmAlert');

	const game = require('../game_modules/game');


// "global" variables needed for all sockets
	let gameIds = [];

	// [
	//  [sock.id, nickname]
	// ]
	let socketNicknames = []; 

	// [
	//  [gameId, confirmedByNr]
	// ]
	let confirmedGameStarts = [];

// settings variables
	// the game is calculated in ticks:
	// a tick is defined by 'fps' therefor its defined as:
	// 1[sec] in milliseconds (1000) / fps
		const tick = 1000/60;


// generateGameId
	// generates a random gameId
	// 
	// return = gameId
	function generateGameId() {
		return Math.random().toString().slice(2, 10);
	}


// createGameId
	// saves requesting client and its nickname in socketNicknames[]
	// 
	// creates a new gameId 
	// generates a random 8-digit code
	// repeats until it is unique by checking whether it is a gameIds[] already
	// adds new gameId to gameIds[]
	// sends new gameId to requesting client
	// joins requesting client to new room
	// 
	// Parameters:
	// nickname = requesting clients nickname
	// sock = requesting client sock
	function createGameId(nickname, sock) {

		// save sock.id with nickname
			socketNicknames.push([sock.id, nickname]);

			console.log('<createGameId> new "registration": [sock.id: ' + sock.id + ', nickname: ' + nickname + ']');
			console.log('<createGameId> updated socketNicknames:', socketNicknames);


		let possibleId = generateGameId();


		// repeat until new gameId is unique
			let gameId = null;

			while (gameId == null) {

				console.log('<createGameId> new possibleId: ' + possibleId);


				// go through gameIds[] and check whether possibleId is currently used
					let idIsUsed = false;

					for (let i = 0; i < gameIds.length; i++) {

						if (gameIds[i] == possibleId) {

							possibleId = generateGameId();

							idIsUsed = true;

							break;

						}

					}


				// add new gameId to gameIds[] if gameId is unique
					if (idIsUsed == false) {

						gameId = possibleId;

						gameIds.push(gameId);

					}

			}

			console.log('<createGameId> updated gameIds:', gameIds);


		// send gameId to sock
			sock.emit('newCustomGameId', gameId);


		// join sock to room
			sock.join(gameId);

	}


// enterGameId
	// checks whether entered gameId is valid
	// checks whether according room is full
	// if valid join attempt -> join room and call sendConfirmAlert
	// 
	// Parameters:
	// enteredGameId = entered gameId by the requesting client
	// nickname = requesting clients nickname
	// sock = requesting client sock
	// io = "socket.io's io"
	function enterGameId(enteredGameId, nickname, sock, io) {

		// check whether entered gameId is currently used
			let currentlyUsedGameId = false;

			// go through gameIds[] and check whether enteredGameId is currently used
				for (let i = 0; i < gameIds.length; i++) {

					if (gameIds[i] == enteredGameId) {

						currentlyUsedGameId = true;

						break;

					}

				}


		// send back with error since entered gameId is currenty not used
			if (currentlyUsedGameId == false) {

				console.log('<enterGameId> ' + sock.id + ' entered the unused gameId ' + enteredGameId);

				sock.emit('roomFullInvalid', enteredGameId);


		// check whether room is "full"
			} else {

				let roomIsFull = true;

				// get socks in room
					io.in(enteredGameId).clients((err, clients) => {

						if (err) {
							console.error('<error><enterGameId> ' + err);
						}


						// if room has only 1 sock and therefor is not "full"
							if (clients.length == 1) {

								roomIsFull = false;

							}


						// send back with error since room has 2 socks
							if (roomIsFull == true) {

								console.log('<enterGameId> ' + sock.id + ' tried entering the full room ' + enteredGameId);

								sock.emit('roomFullInvalid', enteredGameId);


						// valid join attempt -> join
							} else {

								// save sock.id with nickname
									socketNicknames.push([sock.id, nickname]);

									console.log('<enterGameId> new "registration": [sock.id: ' + sock.id + ', nickname: ' + nickname + ']');
									console.log('<enterGameId> updated socketNicknames:', socketNicknames);


								// join socket to room
									sock.join(enteredGameId);


								sendConfirmAlert.sendConfirmAlert(enteredGameId, socketNicknames, io);

							}

					});

			}

	}


// startGame
	// saves that a client in a given room has confirmed to start the game
	// when called the second time it starts the game
	// 
	// Parameters:
	// gameId = gameId of room whoms clients are supposed to confirm the game start
	// io = "socket.io's io"
	function startGame(gameId, io) {

		let gameIsInConfirmedStartArray = false;

		// go through confirmedGameStarts to check whether game room was already added
			for (let i = 0; i < confirmedGameStarts.length; i++) {

				if (confirmedGameStarts[i][0] == gameId) {

					gameIsInConfirmedStartArray = true;

					break;

				}
			}


		// if game room was not added already -> add it to confirmedGameStarts[]
			if (gameIsInConfirmedStartArray == false) {

				confirmedGameStarts.push([gameId, 0]);

			}


		// confirm game start
			let confirmed = false;

			// go through confirmedGameStarts[] and check if the given gameId was confirmed once or twice
				for (let i = 0; i < confirmedGameStarts.length; i++) {

					if (confirmedGameStarts[i][0] == gameId && confirmedGameStarts[i][1] == 0) {

						confirmedGameStarts[i][1] = 1;

						console.log('<startGame> first client conirmed game start in room: ' + gameId)

						break;


					} else if (confirmedGameStarts[i][0] == gameId && confirmedGameStarts[i][1] == 1) {

						confirmedGameStarts[i][1] = 2;

						confirmed = true;

						console.log('<startGame> second client conirmed game start in room: ' + gameId)

						break;

					}

				}


		// if both clients conirmed send showGame to both socks and start game
			if (confirmed == true) {

				console.log('<startGame> starting game in room: ' + gameId);

				io.in(gameId).emit('showGame');

				game.initiateGame(gameId, io, socketNicknames);

				setInterval(game.updateGame, tick, gameId, tick, io);

			}

	}


// exporting modules
	module.exports = {
		createGameId: createGameId,
		enterGameId: enterGameId,
		startGame: startGame
	};