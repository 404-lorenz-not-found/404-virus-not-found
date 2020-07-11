// import modules
	const generateInitialGameState = require('./generateInitialGameState');


// settings variables
	// defining the top left corner and remove food pos of the 27 cells on a 1920x1080 game canvas
		const cellPositions = [
							   [60+180*0, 0, 60+180*0+90, 0+180+90], // first 10 cells at top
							   [60+180*1, 0, 60+180*1+90, 0+180+90],
							   [60+180*2, 0, 60+180*2+90, 0+180+90],
							   [60+180*3, 0, 60+180*3+90, 0+180+90],
							   [60+180*4, 0, 60+180*4+90, 0+180+90],
							   [60+180*5, 0, 60+180*5+90, 0+180+90],
							   [60+180*6, 0, 60+180*6+90, 0+180+90],
							   [60+180*7, 0, 60+180*7+90, 0+180+90],
							   [60+180*8, 0, 60+180*8+90, 0+180+90],
							   [60+180*9, 0, 60+180*9+90, 0+180+90],

							   [0, 180*2, 0+180+90, 180*2+90], // next 2 cells at left
							   [0, 180*3, 0+180+90, 180*3+90],

							   [1920/2-180*1.5, 1080/2-180/2, 1920/2-180*1.5+90, 1080/2-180/2+180+90], // next 3 cells in middle
							   [1920/2-180*0.5, 1080/2-180/2, 1920/2-180*0.5+90, 1080/2-180/2+180+90],
							   [1920/2+180*0.5, 1080/2-180/2, 1920/2+180*0.5+90, 1080/2-180/2+180+90],

							   [1920-180, 180*2, 1920-180-90, 180*2+90], // next 2 cells at right
							   [1920-180, 180*3, 1920-180-90, 180*3+90],

							   [60+180*0, 1080-180, 60+180*0+90, 1080-180-90], // last 10 cells at botttom
							   [60+180*1, 1080-180, 60+180*1+90, 1080-180-90],
							   [60+180*2, 1080-180, 60+180*2+90, 1080-180-90],
							   [60+180*3, 1080-180, 60+180*3+90, 1080-180-90],
							   [60+180*4, 1080-180, 60+180*4+90, 1080-180-90],
							   [60+180*5, 1080-180, 60+180*5+90, 1080-180-90],
							   [60+180*6, 1080-180, 60+180*6+90, 1080-180-90],
							   [60+180*7, 1080-180, 60+180*7+90, 1080-180-90],
							   [60+180*8, 1080-180, 60+180*8+90, 1080-180-90],
							   [60+180*9, 1080-180, 60+180*9+90, 1080-180-90]
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

								let wasteDisappearChance = 0.005;

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
			for (let g = 0; g < gameData.length; g++){

				if (gameData[g][0] == gameId) {

					let tickInfo = gameData[g][1]
					let food = gameData[g][2];
					let cells = gameData[g][3];

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


													// if food is not waste 
														if (food[f][4] != 1) {

															// save cellId in food[] element (-> food does not "join" in next updates but rather is in cell already)
																food[f][5] = c;

															// do not set food[] element free
																setFoodElementFree = false;

														} else {

															// reverse velocity correspondingly
																const currentXPos = food[f][0];
																const currentYPos = food[f][1];
																const currentXVel = food[f][2];
																const currentYVel = food[f][3];

																const lastXPos = currentXPos - currentXVel;
																const lastYPos = currentYPos - currentYVel;


																if (lastXPos <= cellPositions[c][0] || lastXPos >= cellPositions[c][0]+180) {

																	food[f][2] = -food[f][2];

																}

																if (lastYPos <= cellPositions[c][1] || lastYPos >= cellPositions[c][1]+180) {

																	food[f][3] = -food[f][3];

																}

														}


											// if food[] element is in cell already
												} else if (food[f][5] == c) {

													// dont set food[] element free
														setFoodElementFree = false;


													// if food is waste 
														if (food[f][4] == 1) {

															// reverse velocity correspondingly
																const currentXPos = food[f][0];
																const currentYPos = food[f][1];
																const currentXVel = food[f][2];
																const currentYVel = food[f][3];

																const nextXPos = currentXPos + currentXVel;
																const nextYPos = currentYPos + currentYVel;


																if (nextXPos <= cellPositions[c][0] || nextXPos >= cellPositions[c][0]+180) {

																	food[f][2] = -food[f][2];

																	// subtract 1 from cells health
																		cells[c][1] -= 1;

																}

																if (nextYPos <= cellPositions[c][1] || nextYPos >= cellPositions[c][1]+180) {

																	food[f][3] = -food[f][3];

																	// subtract 1 from cells health
																		cells[c][1] -= 1;

																}

														}

												}

										}

								}


							if (setFoodElementFree == true) {

								food[f][5] = 'free';

							}

						}


					// go through cells[]
						for (let i = 0; i < cells.length; i++){

							//  to set 0 health cells id to 'dead'
								if (cells[i][1] <= 0) {

									cells[i][0] = 'dead';

							// if cell is still alive do updates every ... ticks
								} else {

									// cell update variables
										const tickEnergyLoss = 0.016/4;
										const tickDNASlotHealthLoss = 0.016;
										const moveHandEnergyCost = 1;
										const moveHandDNASlotHealthCost = 1.25;
										const readEnergyCost = 1.25;
										const readDNASlotHealthCost = 1.25;
										const writeEnergyCost = 2;
										const writeDNASlotHealthCost = 2;
										const eatEnergyCost = 1;
										const eatDNASlotHealthCost = 1;
										const energyGainOnEat = 9.5-4.5*cells[i][2]/100;
										const energyLossOnWasteEat = energyGainOnEat * 1.5;
										const repairEnergyCost = 1;
										const repairDNASlotHealthCost = 1.25;
										const healthGainOnRepair = 12-4*cells[i][1]/100;
										const removeEnergyCost = 1;
										const removeDNASlotHealthCost = 1;

									// every tick
										// subtract energy
											cells[i][2] -= tickEnergyLoss;

										// keep energy and health between 0-100
											if (cells[i][1] <= 0) {

												cells[i][1] = 0;

											} else if (cells[i][1] >= 100) {

												cells[i][1] = 100;

											}

											if (cells[i][2] <= 0) {

												cells[i][2] = 0;

											} else if (cells[i][2] >= 100) {

												cells[i][2] = 100;

											}

										// subtract current dna slot health or remove if <= 0
											for (let DNASlotId = 0; DNASlotId < cells[i][4].length; DNASlotId ++) {

												cells[i][4][DNASlotId][2] -= tickDNASlotHealthLoss;

												if (cells[i][4][DNASlotId][2] <= 0) {

													cells[i][4][DNASlotId] = ['', '', 0]

												}

											}


									// every 30 ticks
										if (tickInfo[2] % 30 === 0) {

											// move hand to next DNASlot
												cells[i][3][1] += 1;

												if (cells[i][3][1] == 11) {

													cells[i][3][1] = 0;

												}

											// act on DNASlot
												if (cells[i][4][cells[i][3][1]][0] == 'moveHand' && cells[i][2] >= moveHandEnergyCost) {

													cells[i][2] -= moveHandEnergyCost;
													cells[i][4][cells[i][3][1]][2] -= moveHandDNASlotHealthCost;

													if (cells[i][4][cells[i][3][1]][1] == 'outward') {

														cells[i][3][0][0] = 1;

													} else if (cells[i][4][cells[i][3][1]][1] == 'inward') {

														cells[i][3][0][0] = 0;

													} else if (cells[i][4][cells[i][3][1]][1] == 'wall') {

														cells[i][3][0][0] = -1;

													} else if (cells[i][4][cells[i][3][1]][1] == 'weakLoc' && cells[i][3][0][0] == 0) {

														let weakestLoc = 0;
														let mostDegradation = 100;

														for (let DNASlotId = 0; DNASlotId < cells[i][4].length; DNASlotId ++) {

															if (cells[i][4][DNASlotId][2] <= mostDegradation) {

																weakestLoc = DNASlotId;
																mostDegradation = cells[i][4][DNASlotId][2];

															}

														}

														cells[i][3][0][1] = weakestLoc;

													}


												} else if (cells[i][4][cells[i][3][1]][0] == 'read' && cells[i][2] >= readEnergyCost && cells[i][3][0][0] == 0) {

													cells[i][2] -= readEnergyCost;
													cells[i][4][cells[i][3][1]][2] -= readDNASlotHealthCost;

													cells[i][5] = [cells[i][4][cells[i][3][0][1]][0], cells[i][4][cells[i][3][0][1]][1], cells[i][4][cells[i][3][0][1]][2]];

												} else if (cells[i][4][cells[i][3][1]][0] == 'write' && cells[i][2] >= writeEnergyCost && cells[i][3][0][0] == 0) {

													cells[i][2] -= writeEnergyCost;
													cells[i][4][cells[i][3][1]][2] -= writeDNASlotHealthCost;

													cells[i][4][cells[i][3][0][1]][0] = cells[i][5][0];
													cells[i][4][cells[i][3][0][1]][1] = cells[i][5][1];
													cells[i][4][cells[i][3][0][1]][2] = 100;

												} else if (cells[i][4][cells[i][3][1]][0] == 'eat' && cells[i][2] >= eatEnergyCost && cells[i][3][0][0] == 1) {

													cells[i][2] -= eatEnergyCost;
													cells[i][4][cells[i][3][1]][2] -= eatDNASlotHealthCost;

													if (cells[i][4][cells[i][3][1]][1] == 'food') {

														let foodEaten = false;

														for (let f = 0; f < food.length; f ++) {

															if (food[f][5] == i && food[f][4] == 0 && foodEaten == false) {

																food[f][4] = 1;
																cells[i][2] += energyGainOnEat;
																foodEaten = true;

															}

														}

													} else if (cells[i][4][cells[i][3][1]][1] == 'waste') {

														let wasteEaten = false;

														for (let f = 0; f < food.length; f ++) {

															if (food[f][5] == i && food[f][4] == 1 && wasteEaten == false) {

																cells[i][2] -= energyLossOnWasteEat;
																wasteEaten = true;

															}

														}

													} else if (cells[i][4][cells[i][3][1]][1] == 'wall') {

														cells[i][1] = 0;

													}

												} else if (cells[i][4][cells[i][3][1]][0] == 'repair' && cells[i][2] >= repairEnergyCost && cells[i][3][0][0] == 1) {

													cells[i][2] -= repairEnergyCost;
													cells[i][4][cells[i][3][1]][2] -= repairDNASlotHealthCost;

													if (cells[i][4][cells[i][3][1]][1] == 'wall') {

														cells[i][1] += healthGainOnRepair;

													} else if (cells[i][4][cells[i][3][1]][1] == 'food') {

														let foodRepaired = false;

														for (let f = 0; f < food.length; f ++) {

															if (food[f][5] == i && food[f][4] == 0 && foodRepaired == false) {

																food[f][4] = 1;
																foodRepaired = true;

															}

														}

													}

												} else if (cells[i][4][cells[i][3][1]][0] == 'remove' && cells[i][2] >= removeEnergyCost && cells[i][3][0][0] == 1) {

													cells[i][2] -= removeEnergyCost;
													cells[i][4][cells[i][3][1]][2] -= removeDNASlotHealthCost;

													if (cells[i][4][cells[i][3][1]][1] == 'waste') {

														let foodRemoved = false;

														for (let f = 0; f < food.length; f ++) {

															if (food[f][5] == i && food[f][4] == 1 && foodRemoved == false) {

																food[f][0] = cellPositions[i][2];
																food[f][1] = cellPositions[i][3];
																food[f][5] = 'free';
																foodRemoved = true;

															}

														}

													} else if (cells[i][4][cells[i][3][1]][1] == 'wall') {

														cells[i][1] = 0;

													}

												}

										}

								}

						}


					// save changes to gameData
						gameData[g][1] = tickInfo;
						gameData[g][2] = food;
						gameData[g][3] = cells;

				}

			}

	}


// updatePoints
	// updates poits in given game
	// 
	// Parameters:
	// gameId = gameId of game whoms cells are supposed to be updated
	// gameData = array where the data of all games is stored
	function updatePoints(gameId, gameData) {

	// go through gameData[] to get current game
		for (let g = 0; g < gameData.length; g++){

			if (gameData[g][0] == gameId) {

				let tickInfo = gameData[g][1]
				let points = gameData[g][5]

				const pointsPerSecond = 1;


				// every 60 ticks
					if (tickInfo[2] % 60 === 0) {

						points[0][1] += pointsPerSecond;
						points[1][1] += pointsPerSecond;

					}


				// save changes to gameData
					gameData[g][5] = points;

			}

		}

	}


// exporting modules
	module.exports = {
		updateFood: updateFood,
		updateCells: updateCells,
		updatePoints: updatePoints
	};