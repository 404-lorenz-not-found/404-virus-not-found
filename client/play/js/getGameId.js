// getGameId
	// if defined gets gameId from query string
	// otherwise promts client to input gameId
	// 
	// Parameters:
	// queries = query string
	export function getGameId(queries) {

		let gameId = '';


		// loop through quieries
			for (let i = 1; i < queries.length; i++) {

				// get possibleGameIdQuery
					let possibleGameIdQuery = queries[i].split('=');

				// check if possibleGameIdQuery is a gameId query
					if (possibleGameIdQuery[0] = 'gameId') {

						gameId = possibleGameIdQuery[1];

						break;

					}

			}


		// while gameId is '' either from invalid queryString or not defined or an invalid code has been entered
			while (gameId == '') {
				
				// ask for gameId
					let enteredGameId = prompt('Please enter the code you were given:');


				// send back to join page if prompt is canceled
					if (enteredGameId === null) {

						// send back to join page
							window.open('../../join/join.html', '_self');


				// invalid code alert if gameId is not 8 digits
					} else if (enteredGameId.length != 8) {

						alert('Invalid code.\nPlease try again.');


				// if an 8 digit code has been entered
					} else {

						gameId = enteredGameId;

					}

			}

		return gameId;

	}