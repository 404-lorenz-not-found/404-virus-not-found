// settings variables
	// canvas context
		let ctx;

// gameData parts for easier access during drawing
	let food = [];
	let cells = [];

// game Colors
	const foodColor = '#FF0000';
	const wasteColor = '#666666';

	const cellColorNeutral = '#cccccc';
	const cellColorWall = '#000000';

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
						// ctx.fillText(food[i][5], getClientWidth(food[i][0]), getClientHeight(food[i][1]));

			}

	}

// drawCells
	// draws the cells[] of the game
	function drawCells() {

		ctx.font = '20px Arial';
		ctx.textBaseline = 'top';

		ctx.beginPath();

		// for each cells[] element
			for (let i = 0; i < cells.length; i++) {

				if (cells[i][0] != 'dead') {

					// draws cell
						// draw cell background
							ctx.fillStyle = cellColorNeutral;
							ctx.rect(getClientWidth(cellPositions[i][0]), getClientHeight(cellPositions[i][1]), getClientWidth(180), getClientHeight(180));
							ctx.fill();

						// draw cell boarder
							ctx.StrokeStyle = cellColorWall;
							ctx.lineWidth = cells[i][1]/10;
							ctx.stroke();

						// draw health and energy
							ctx.fillStyle = textColor;
							ctx.beginPath();

							// draw health
								ctx.textAlign = "start";
								ctx.fillText(cells[i][1] + ' H', getClientWidth(cellPositions[i][0]+10), getClientHeight(cellPositions[i][1]+10));

							// draw energy
								ctx.textAlign = "end";
								ctx.fillText(cells[i][2] + ' E', getClientWidth(cellPositions[i][0]+180-10), getClientHeight(cellPositions[i][1]+10));

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
	export function updateGame(gameData) {

		food = gameData[2];
		cells = gameData[3];

		document.getElementById('ticksCalculated').innerHTML = gameData[1][2];

	}