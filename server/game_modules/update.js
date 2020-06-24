// import modules
	const generateInitialGameState = require('./generateInitialGameState');


// settings variables
	// defining the top left corner of the 27 cells on a 1920x1080 game canvas
		const cellPositions = [
							   [60+180*0, 0], // first 10 cells at top
							   [60+180*1, 0],
							   [60+180*2, 0],
							   [60+180*3, 0],
							   [60+180*4, 0],
							   [60+180*5, 0],
							   [60+180*6, 0],
							   [60+180*7, 0],
							   [60+180*8, 0],
							   [60+180*9, 0],

							   [0, 180*2], // next 2 cells at left
							   [0, 180*3],

							   [1920/2-180*1.5, 1080/2-180/2], // next 3 cells in middle
							   [1920/2-180*0.5, 1080/2-180/2],
							   [1920/2+180*0.5, 1080/2-180/2],

							   [1920-180, 180*2], // next 2 cells at right
							   [1920-180, 180*3],

							   [60+180*0, 1080-180], // last 10 cells at botttom
							   [60+180*1, 1080-180],
							   [60+180*2, 1080-180],
							   [60+180*3, 1080-180],
							   [60+180*4, 1080-180],
							   [60+180*5, 1080-180],
							   [60+180*6, 1080-180],
							   [60+180*7, 1080-180],
							   [60+180*8, 1080-180],
							   [60+180*9, 1080-180]
							  ];


// updateFood
	// updates the food for a given game
	// 
	// Parameters:
	// gameId = gameId of game whoms food is supposed to be updated
	// gameData = array where the data of all games is stored
	// dimensions = dimensions of the "canvas" wherefor the game is calculated
	function updateFood (gameId, gameData, dimensions) {

		// [[coordX, coordY, velX, velY, food(0)/waste(1), 'free'/cellId], ...]
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


							// "blood disappear system"
								let foodType = oldFood[i][4];

								let foodElement = [coordX, coordY, newVelX, newVelY, foodType, oldFood[i][5]];

								let wasteDisappearChance = 0.025;

								// if "free" and waste
									if (oldFood[i][5] == 'free' && foodType == 1) {

										let disappearChance = Math.random();

										if (disappearChance < wasteDisappearChance) {

											foodElement = generateInitialGameState.generateFoodElement(dimensions);

										}

									}


							// add newly calculated food element to newFood[]
								newFood.push(foodElement)

						}


					// overwrite old food data with new food data
						gameData[i][2] = newFood;

				}

			}

	}


// updateCells
	// updates cells in given game
	// 
	// Parameters:
	// gameId = gameId of game whoms cells are supposed to be updated
	// gameData = array where the data of all games is stored
	function updateCells(gameId, gameData) {

		// go through gameData[] to get current game
			for (let i = 0; i < gameData.length; i++){

				if (gameData[i][0] == gameId) {

					let food = gameData[i][2];
					let cells = gameData[i][3];

					// for each food[] element
						for (let f = 0; f < food.length; f ++) {

							let setFoodElementFree = true;

							// for each cells[] element
								for (let c = 0; c < cells.length; c ++) {

									// if food element is in cell
										if (food[f][0] > cellPositions[c][0] && food[f][0] < cellPositions[c][0]+180 && food[f][1] > cellPositions[c][1] && food[f][1] < cellPositions[c][1]+180 && cells[c][0] != 'dead') {

											// if food element "joined" cell (cellId is not saved in food[] element)
												if (food[f][5] != c) {

													// subtract 1 from cells health
														cells[c][1] -= 1;

													// save cellid in food[] element (-> food does not "join" in next updates but rather is in cell already)
													food[f][5] = c;

													// dont set food[] element free
														setFoodElementFree = false;

											// if food[] element is in cell already
												} else if (food[f][5] == c) {

													// dont set food[] element free
														setFoodElementFree = false;

												}

										}

								}


							if (setFoodElementFree == true) {

								food[f][5] = 'free';

							}

						}


					// go through cells[] to set 0 health cells id to 'dead'
						for (let i = 0; i < cells.length; i++){

							if (cells[i][1] <= 0) {

								cells[i][0] = 'dead';

							}

						}


					// save changes to gameData
						gameData[i][2] = food;
						gameData[i][3] = cells;

				}

			}

	}


// exporting modules
	module.exports = {
		updateFood: updateFood,
		updateCells: updateCells
	};