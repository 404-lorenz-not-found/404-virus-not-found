// gameData parts for easier access during drawing
	let food = [];

// game Colors
	const foodColor = '#FF0000'


// drawFood
	// draws the food[] of the game
	// 
	// Parameters:
	// ctx = canvas canvas (ctx)
	function drawFood(ctx) {

		// for ech food[] element
			for (let i = 0; i < food.length; i++) {

				// draws food[] element
					ctx.beginPath();

					// "sets" coordinates of food[] element by callculating ist coordinates from coordinates of food[] according to the clients canvas size
						ctx.arc(food[i][0]/1920*ctx.canvas.width, food[i][1]/1080*ctx.canvas.height, 5/1920*ctx.canvas.width, 0, 2 * Math.PI, false);

					ctx.fillStyle = foodColor;

					ctx.fill();

			}

	}


// draw
	// draws game to clients page
	// -> gets canvas ctx
	// fills background
	// calls draw functions for all game parts
	// calls itself as soon as ready to draw next frame with newest gameData
export function draw() {

	// get canvas ctx
		const canvas = document.querySelector('#gameCanvas');
		const ctx = canvas.getContext('2d');


	// fill background
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);


	// draw game
		drawFood(ctx);


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

		document.getElementById('ticksCalculated').innerHTML = gameData[1][2];

	}