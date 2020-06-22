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


// generateFood
	// generates food for the game beginning
	// 
	// Parameters:
	// dimensions = dimensions of the "canvas" wherefor the game is calculated
	function generateFood(dimensions) {

		// settings variables
			// number of food at start
				const foodCount = 250;

			// max velocity (positive and negative)
				let maxVel = 3; // not sure how flaots are handled; getting confused; ~ Lorenz

				// account for positive and negative and no velocity
					let velocityHelper = maxVel * 2 + 1

		// generate food
			// [x, y, x-vel, y-vel]
			let food = [];

			// for each food populate food[]
				for (let i = 0; i < foodCount; i++){

					// generate food element data set
						let possibleNewFoodElement = [
													  Math.floor(Math.random() * (dimensions[1] - dimensions[0] + 1) + dimensions[0]), // generate random x-coordinate
													  Math.floor(Math.random() * (dimensions[3] - dimensions[2] + 1) + dimensions[2]), // generate random y-coordinate
													  generateRandomFoodVel(velocityHelper),
													  generateRandomFoodVel(velocityHelper)
													 ]


					// if velocity is 0 for x and y generate new velocities untli they are not both 0
						while (possibleNewFoodElement[2] == velocityHelper && possibleNewFoodElement[3] == velocityHelper) {

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

					// add new generated food element to food[]
						food.push(possibleNewFoodElement);

				}

		return food;

	}


// generateInitialGameState
	// generates the gameDate at the beginning of a game
	// 
	// Parameters:
	// gameId = gameId of game whoms gameDate is supposed to be generated
	// gameData = array where the data of all games is stored
	// dimensions = dimensions of the "canvas" wherefor the game is calculated
	function generateInitialGameState(gameId, gameData, dimensions) {

		console.log('<generateInitialGameState> generating initial game state for game ' + gameId);

		// add element to gameData for new game
			gameData.push([gameId]);


		// update gameData[] with generated data
			// go through gameData[] and check for gameId to add generated game data to corresponding element
				for (let i = 0; i < gameData.length; i++){

					if (gameData[i][0] == gameId) {

						// set tick info
							gameData[i][1] = [Date.now(), 0, 0];

						// set generated food
							gameData[i][2] = generateFood(dimensions);

						break;

					}

				}

	}


// exporting modules
	module.exports = {
		generateInitialGameState: generateInitialGameState
	};