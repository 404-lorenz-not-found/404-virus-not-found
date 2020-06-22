// updateFood
	// updates the food for a given game
	// 
	// Parameters:
	// gameId = gameId of game whoms food is supposed to be updated
	// gameData = array where the data of all games is stored
	// dimensions = dimensions of the "canvas" wherefor the game is calculated
	function updateFood (gameId, gameData, dimensions) {

		// [[coordX, coordY, velX, velY], ...]
		let newFood = [];

		// go through gameData[] to get current food[] (oldFood[])
			for (let i = 0; i < gameData.length; i++){

				if (gameData[i][0] == gameId) {

					let oldFood = gameData[i][2];

					// for each food[] element
						for (let i = 0; i < oldFood.length; i ++) {

							let newVelX = oldFood[i][2];
							let newVelY = oldFood[i][3];

							// calculated new coordinates
								// new coordinates = old coordinates + velocity
								let coordX = oldFood[i][0] + newVelX;
								let coordY = oldFood[i][1] + newVelY;


							// inverse velocity if element is at a border
								if (coordX < dimensions[0] || coordX > dimensions[1]) {
									newVelX = -newVelX;
								}

								if (coordY < dimensions[2] || coordY > dimensions[3]) {
									newVelY = -newVelY;
								}


							// add newly calculated food element to newFood[]
							newFood.push([coordX, coordY, newVelX, newVelY])

						}


					// replaye old food data with new food data
						gameData[i][2] = newFood;

				}

			}

	}


// exporting modules
	module.exports = {
		updateFood: updateFood
	};