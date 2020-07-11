// generateRandomFoodVel
	// generates random velocity for a food element
	// 
	// Parameters:
	// velocityHelper = max velocity (above 0) + max velocity (below 0) + 1 (0)
	// 
	// return = velocity
	function generateRandomFoodVel(velocityHelper) {
		return Math.floor(Math.random() * (velocityHelper - 1 + 1) + 1);
	}


// generateFoodElement
	// generates a food element
	// 
	// Parameters:
	// dimensions = dimensions of the "canvas" wherefor the game is calculated
	// 
	// return = food[] element
	function generateFoodElement(dimensions) {

		// settings variables
			// max velocity (positive and negative)
				let maxVel = 3; // not sure how flaots are handled; getting confused; ~ Lorenz

				// account for positive and negative and no velocity
					let velocityHelper = maxVel * 2 + 1


		let possibleNewFoodElement = [
									  Math.floor(Math.random() * (dimensions[1] - dimensions[0] + 1) + dimensions[0]), // generate random x-coordinate
									  Math.floor(Math.random() * (dimensions[3] - dimensions[2] + 1) + dimensions[2]), // generate random y-coordinate
									  generateRandomFoodVel(velocityHelper),
									  generateRandomFoodVel(velocityHelper),
									  0,
									  'free'
									 ]


		// if velocity is 0 for x or y generate new velocities until they both are not 0
			while (possibleNewFoodElement[2] == velocityHelper || possibleNewFoodElement[3] == velocityHelper) {

				possibleNewFoodElement[2] = generateRandomFoodVel(velocityHelper);
				possibleNewFoodElement[3] = generateRandomFoodVel(velocityHelper);

			}


		// adjust velocities to account for negative or 0 velocity
			// if velocity is bigger than maxVel substract velocityHelper to get 0 or corresponding negative velocity
				// x
					if (possibleNewFoodElement[2] > maxVel) {

						possibleNewFoodElement[2] -= velocityHelper;

					}

				// y
					if (possibleNewFoodElement[3] > maxVel) {

						possibleNewFoodElement[3] -= velocityHelper;

					}


		return possibleNewFoodElement;

	}


// generateFood
	// generates food for the game beginning
	// 
	// Parameters:
	// dimensions = dimensions of the "canvas" wherefor the game is calculated
	// 
	// return = food[]
	function generateFood(dimensions) {

		// settings variables
			// number of food at start
				const foodCount = 150;


		// generate food
			// [x, y, x-vel, y-vel, food(0)/waste(1), 'free'/cellId]
			let food = [];

			// for each food populate food[]
				for (let i = 0; i < foodCount; i++) {

					// add new generated food element to food[]
						food.push(generateFoodElement(dimensions));

				}

		return food;

	}


// generateCell
	// generates cells[] element for the game beginning
	// 
	// Parameters:
	// id = id for cell to generate
	// 
	// return = cell[]
	function generateCell(id) {

		// settings variables
			const wallHealth = Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25);
			const cellEnergy = Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25);


		const dna = [
					 ['moveHand', 'outward', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['eat', 'food', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['remove', 'waste', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['repair', 'wall', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['eat', 'food', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['remove', 'waste', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['repair', 'wall', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['moveHand', 'inward', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['moveHand', 'weakLoc', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['read', 'DNASlot', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)],
					 ['write', 'DNASlot', Math.floor(Math.random () * (100 - 60.25 + 1) + 60.25)]
					]

		const pointerPosStart = Math.floor(Math.random() * (10 - 0 + 1) + 0);

		let handStart = 0;

		if (pointerPosStart <= 7) {

			const handStart = 1;

		}

		let cell = [id, wallHealth, cellEnergy, [[handStart, Math.floor(Math.random() * (10 - 0 + 1) + 0)], pointerPosStart], dna, []];


		return cell;

	}


// generateCells
	// generates cells for the game beginning
	// 
	// return = food[]
	function generateCells() {

		// settings variables
			// number of cells at start
				const cellCount = 27;


		// generate cells
			// [[id/'dead', wallHealth, cellEnergy, [[0=HandIn/1=HandOut, handPos(0-10)], pointerPos(0-10)], ["DNA"]], ...]
			let cells = [];

			// for each cell populate cells[]
				for (let i = 0; i < cellCount; i++) {

					// add new generated cell[] to cells[]
						cells.push(generateCell(i));

				}

		return cells;

	}


// generateInitialGameState
	// generates the gameDate at the beginning of a game
	// 
	// Parameters:
	// gameId = gameId of game whoms gameDate is supposed to be generated
	// gameData = array where the data of all games is stored
	// dimensions = dimensions of the "canvas" wherefor the game is calculated
	function generateInitialGameState(gameId, gameData, dimensions, io, socketNicknames) {

		console.log('<generateInitialGameState> generating initial game state for game ' + gameId);

		// add element to gameData for new game
			gameData.push([gameId]);


		// update gameData[] with generated data
			// go through gameData[] and check for gameId to add generated game data to corresponding element
				for (let i = 0; i < gameData.length; i++){

					if (gameData[i][0] == gameId) {

						// set tick info
							gameData[i][1] = [Date.now(), 0, 0];

						// set game
							// set generated food
								gameData[i][2] = generateFood(dimensions);

							// set generated cells
								gameData[i][3] = generateCells();

							gameData[i][4] = [];

							gameData[i][5] = [];


							// get socks in room
								io.in(gameId).clients((err, clients) => {

									if (err) {
										console.error('<error><generateInitialGameState> ' + err);
									}


									// get nicknames from socks in room
										let players = [];

										// go through socketNicknames[] an check for sock.id (clients[0 or 1]) then take nickname
											for (let i = 0; i < socketNicknames.length; i++) {

												if (socketNicknames[i][0] == clients[0] || socketNicknames[i][0] == clients[1]) {

													players.push(socketNicknames[i][0]);

												}

											}


									const pointsAtGameStart = 100;

									gameData[i][5] = [[players[0], pointsAtGameStart], [players[1], pointsAtGameStart]];

								});

						break;

					}

				}

	}


// exporting modules
	module.exports = {
		generateInitialGameState: generateInitialGameState,
		generateFoodElement: generateFoodElement
	};