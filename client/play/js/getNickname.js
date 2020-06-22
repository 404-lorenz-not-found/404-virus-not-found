// getNickname
	// if defined gets nickname from query string
	// otherwise promts client to input a nickname
	// 
	// Parameters:
	// queries = query string
	// 
	// return = nickname
	export function getNickname(queries) {

		let nickname = ''


		// loop through quieries
			for (let i = 1; i < queries.length; i++) {

				// get possibleNicknameQuery
					let possibleNicknameQuery = queries[i].split('=');

				// check if possibleNicknameQuery is nickname
					if (possibleNicknameQuery[0] = 'nickname') {

						nickname = possibleNicknameQuery[1];

						break;

					}

			}


		// if nickname is '' either from invalid queryString or not defined
			if (nickname == '') {
				
				// ask for nickname
					let nicknamePromt = prompt('Please choose a nickname:', 'Guest');

				// set nickname to 'Guest' if nickname ''
					if (nicknamePromt == '') {

						nickname = 'Guest';


				// send back to join page if prompt is canceled
					} else if (nicknamePromt === null) {

						window.open('../../join/join.html', '_self');

				// if nickname is entered
					} else {

						nickname = nicknamePromt;

					}

			}

	return nickname;

	}