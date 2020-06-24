// import modules
	const generateInitialGameState = require('./generateInitialGameState');

	const update = require('./update');


// 'global' variables needed for all games
	// [
	//  [
	//   gameId
	//   [
	//    millisecondsLastCheck
	//    millisecondsToAdjust
	//    ticksCalculated
	//   ]
	//   ["food"]
	//   ["cells"]
	//  ]
	// ]
	let gameData = [];

// settings variables
	// the game is calculated on a "canvas" with an aspect ratio of 16 to 9 with the following dimensions:
	// on the client side everything to draw will be calculated to fit on the clients canvas
		const maxX = 1920 // width (x)
		const maxY = 1080 // height (y)

		const minX = 0
		const minY = 0

		const dimensions = [minX, maxX, minY, maxY];


// initiateGame
	// calls generateInitialGameState
	// 
	// Parameters:
	// gameId = gameId of game wich is supposed to be started
	function initiateGame(gameId) {
		generateInitialGameState.generateInitialGameState(gameId, gameData, dimensions);
	}


// updateGame
	// handles game ticks
	// calls updates for all game parts
	// send updated gameData to socks
	// 
	// Parameters:
	// gameId = gameId of game to update
	// tick = defined tickrate
	// io = "socket.io's io"
	function updateGame(gameId, tick, io) {

		// calculate number of ticks to do
			let ticksToDo = 0;

			// get tick info
				// go through gameData and check for gameId
					for (let i = 0; i < gameData.length; i++){

						if (gameData[i][0] == gameId) {

							// get time of last update
								let millisecondsLastCheck = gameData[i][1][0];
								// console.log('<updateGame> millisecondsLastCheck: ' + millisecondsLastCheck);

							// set last update time to now
								gameData[i][1][0] = Date.now();

							// get time now
								let millisecondsNow = Date.now();
								// console.log('<updateGame> millisecondsNow: ' + millisecondsNow);

							// get milliseconds to adjust from last update
								let millisecondsToAdjust =  gameData[i][1][1];
								// console.log('<updateGame> millisecondsToAdjust: ' + millisecondsToAdjust);

							// calculate passed milliseconds since last update
								let millisecondsPassed = millisecondsNow - millisecondsLastCheck;
								// console.log('<updateGame> millisecondsPassed: ' + millisecondsPassed);

							// add milliseconds to adjust from last update to milliseconds passed since last update
								millisecondsPassed += millisecondsToAdjust;
								// console.log('<updateGame> millisecondsPassed + millisecondsToAdjust: ' + millisecondsPassed);

							// calculate ticks to calculate now
								ticksToDo = Math.floor(millisecondsPassed / tick);
								// console.log('<updateGame> ticksToDo: ' + ticksToDo);

							// calculate and set new milliseconds to adjust for next update
								gameData[i][1][1] = millisecondsPassed - ticksToDo * tick;
								// console.log('<updateGame> new millisecondsToAdjust: ' + gameData[i][1][1]);

							// add ticks to update to client tick counter
								gameData[i][1][2] += ticksToDo;

							break;

						}

					}


		// update game for one tick each (to update game as accuratly as possible) until all ticks to catch up time are calculated
			for (let ticksDone = 0; ticksDone < ticksToDo; ticksDone++) {

				// call each game updater for each part of the game
					update.updateFood(gameId, gameData, dimensions);
					update.updateCells(gameId, gameData);

			}


		// send updated gameData to sock in game
			for (let i = 0; i < gameData.length; i++){

				if (gameData[i][0] == gameId) {

					io.in(gameId).emit('updateGame', gameData[i]);

					console.log('<updateGame> updated game ' + gameId + ' by ' + ticksToDo + ' tick(s)');

					break;

				}

			}

	}


// exporting modules
	module.exports = {
		initiateGame: initiateGame,
		updateGame: updateGame
	};