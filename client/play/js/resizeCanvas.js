// resizeCanvas
	// fits canvas in clients page
	export function resizeCanvas() {

		// get canvas ctx
			const canvas = document.querySelector('#gameCanvas');
			const ctx = canvas.getContext('2d');

		// set canvas size
			ctx.canvas.height = window.innerHeight-document.getElementById('playerInfo').offsetHeight;
			ctx.canvas.width = ctx.canvas.height/9*16;

			// adjust canvas size if due to the 16 to 9 aspect ration the game is higher than page
			// -> define height first and calculate width accordingly
				if (ctx.canvas.width > window.innerWidth) {

					ctx.canvas.width = window.innerWidth;
					ctx.canvas.height = ctx.canvas.width/16*9;

				}

	}