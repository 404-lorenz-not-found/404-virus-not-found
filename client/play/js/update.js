// settings variables
	// canvas context
		let ctx;

// gameData parts for easier access during drawing
	let food = [];
	let cells = [];
	let points = [];

// game Colors
	const foodColor = '#FF0000';
	const wasteColor = '#666666';

	const cellColorNeutral = '#cccccc';
	const cellColorWall = '#000000';
	const cellColorDNASlot = '#b3b3b3';
	const cellColorDNASlotBorder = '#999999';
	const cellColorDNASlotActive = '#80ff80';
	const cellColorDNASlotDegradation = '#808080';
	const DNAText = '#000000';
	const handColor = '#003300';

	const textColor = '#000000';

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
						  ]


// getClientWidth
	// calculates canvas x-coordinate based on clients canvas
	// 
	// Parameters:
	// coord = "real" x-coordinate
	// 
	// return = x-coordinate for clients canvas
	function getClientWidth(coord) {
		return coord/1920*ctx.canvas.width;
	}


// getClientHeight
	// calculates canvas y-coordinate based on clients canvas
	// 
	// Parameters:
	// coord = "real" y-coordinate
	// 
	// return = y-coordinate for clients canvas
	function getClientHeight(coord) {
		return coord/1080*ctx.canvas.height;
	}


// drawFood
	// draws the food[] of the game
	function drawFood() {

		// for ech food[] element
			for (let i = 0; i < food.length; i++) {

				// draws food[] element
					ctx.beginPath();

					// "sets" coordinates of food[] element by callculating ist coordinates from coordinates of food[] according to the clients canvas size
						ctx.arc(getClientWidth(food[i][0]), getClientWidth(food[i][1]), getClientWidth(5), 0, 2 * Math.PI, false);


					// check for food or waste
						if (food[i][4] == 0) {

							ctx.fillStyle = foodColor;

						} else if (food[i][4] == 1) {

							ctx.fillStyle = wasteColor;

						}

					ctx.fill();


					// write extra info below each food[] element (debug) ~ Lorenz
						// ctx.textAlign = "center";
						// ctx.fillText(food[i][4]+', '+food[i][5], getClientWidth(food[i][0]), getClientHeight(food[i][1]));

			}

	}

// drawCells
	// draws the cells[] of the game
	function drawCells() {

		ctx.textBaseline = 'top';

		// for each cells[] element
			for (let i = 0; i < cells.length; i++) {

				if (cells[i][0] != 'dead') {

					// draws cell
						// draw cell background
							ctx.beginPath();
							ctx.fillStyle = cellColorNeutral;
							ctx.rect(getClientWidth(cellPositions[i][0]), getClientHeight(cellPositions[i][1]), getClientWidth(180), getClientHeight(180));
							ctx.fill();

						// draw cell border
							ctx.StrokeStyle = cellColorWall;
							ctx.lineWidth = cells[i][1]/10;
							ctx.stroke();


						// draw health and energy
							ctx.fillStyle = textColor;
							ctx.font = '20px Arial';
							ctx.beginPath();

							// draw health
								ctx.textAlign = "start";
								ctx.fillText(cells[i][1].toFixed(1) + ' H', getClientWidth(cellPositions[i][0]+10), getClientHeight(cellPositions[i][1]+10));

							// draw energy
								ctx.textAlign = "end";
								ctx.fillText(cells[i][2].toFixed(1) + ' E', getClientWidth(cellPositions[i][0]+180-10), getClientHeight(cellPositions[i][1]+10));


						// draw dna
							for (let DNASlotId = 0; DNASlotId < cells[i][4].length; DNASlotId ++) {

								// draw slots
									ctx.beginPath();

									// give DNA slot different background if active
										if (cells[i][3][1] == DNASlotId) {

											ctx.fillStyle = cellColorDNASlotActive;

										} else {

											ctx.fillStyle = cellColorDNASlot;

										}

									ctx.rect(getClientWidth(cellPositions[i][0]+10), getClientHeight(cellPositions[i][1]+10+20+8+12*DNASlotId), getClientWidth(180-10-10-5-12), getClientHeight(12));
									ctx.fill();
									ctx.StrokeStyle = cellColorDNASlotBorder;
									ctx.lineWidth = 1;
									ctx.stroke();



									ctx.beginPath();
									ctx.fillStyle = cellColorDNASlotDegradation;
									ctx.rect(getClientWidth(cellPositions[i][0]+10), getClientHeight(cellPositions[i][1]+10+20+8+12*DNASlotId), getClientWidth((180-10-10-5-12)*cells[i][4][DNASlotId][2]/100), getClientHeight(12));
									ctx.fill();
									ctx.StrokeStyle = cellColorDNASlotDegradation;
									ctx.lineWidth = 1;
									ctx.stroke();



								// draw dna text
									ctx.beginPath();
									ctx.textAlign = "start";
									ctx.font = '12px Arial';
									ctx.fillStyle = DNAText;
									ctx.fillText(cells[i][4][DNASlotId][0] + ' : ' + cells[i][4][DNASlotId][1], getClientWidth(cellPositions[i][0]+10), getClientHeight(cellPositions[i][1]+10+20+8+12*DNASlotId));


								// draw hand
									// if current slot is hand position
										if (cells[i][3][0][1] == DNASlotId) {

											// if hand faces outwards
												if (cells[i][3][0][0] == 1) {

													ctx.beginPath();
													ctx.fillStyle = handColor;
													ctx.rect(getClientWidth(cellPositions[i][0]+180-10-12), getClientHeight(cellPositions[i][1]+10+20+8+12*DNASlotId), getClientWidth(12), getClientHeight(12));
													ctx.fill();


											// if hand faces inwards
												} else if (cells[i][3][0][0] == 0) {

													ctx.beginPath();
													ctx.fillStyle = handColor;
													ctx.moveTo(getClientWidth(cellPositions[i][0]+180-10-12), getClientHeight(cellPositions[i][1]+10+20+8+12*DNASlotId+6));
													ctx.lineTo(getClientWidth(cellPositions[i][0]+180-10), getClientHeight(cellPositions[i][1]+10+20+8+12*DNASlotId+12));
													ctx.lineTo(getClientWidth(cellPositions[i][0]+180-10), getClientHeight(cellPositions[i][1]+10+20+8+12*DNASlotId));
													ctx.closePath();
													ctx.fill();

												}

										}

							}

				}

			}

	}


// draw
	// draws game to clients page
	// -> gets canvas ctx
	// fills background
	// calls draw functions for all game parts
	// calls itself as soon as ready to draw next frame with newest gameData
	export function draw() {

	// get canvas context (ctx)
		const canvas = document.querySelector('#gameCanvas');
		ctx = canvas.getContext('2d');


	// fill background
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);


	// draw game
		drawCells();
		drawFood();


	// draw next frame
		window.requestAnimationFrame(draw);

	}


// updateGame
	// parses new gameData from server independently from drawing
	// 
	// Parameters:
	// gameDate = array containing all updated data for this game
	export function updateGame(gameData, sock) {

		food = gameData[2];
		cells = gameData[3];
		points = gameData[5];


		document.getElementById('ticksCalculated').innerHTML = gameData[1][2];

		if (points[0][0] == sock.id) {

			document.getElementById('playerInfoPoints').innerHTML = points[0][1];
			document.getElementById('OpponentPlayerInfoPoints').innerHTML = points[1][1];

		} else {

			document.getElementById('OpponentPlayerInfoPoints').innerHTML = points[0][1];
			document.getElementById('playerInfoPoints').innerHTML = points[1][1];

		}

	}