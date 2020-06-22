// import
	import {getNickname} from './getNickname.js';
	import {getGameId} from './getGameId.js';


// onMethod
	// parses query string
	// checks for join method
	// 
	// Parameters:
	// sock = client sock
	// 
	// return = nickname
	export function onMethod(sock) {

		let nickname = '';


		// parse queryString
			let queryString = decodeURIComponent(window.location.search);

			queryString = queryString.substring(1);

			const queries = queryString.split('&');


		// get join method
			const methodQuery = queries[0].split('=');


		// checks join method
			// if join method = createCustomGame
				if (methodQuery[1] == 'createCustomGame') {

					// show waitingCustomGameDiv
						document.querySelector('#waitingCustomGameDiv').className = 'waitingCustomGameDiv';


					nickname = getNickname(queries);


					// send mode and nickname to server to setup room and generate gameId
						sock.emit('createGameId', nickname);


					// write nickname in waitingCustomGameNickname
						document.querySelector('#waitingCustomGameNickname').innerHTML = nickname;


			// if join method = enterCustomGame
				} else if (methodQuery[1] == 'enterCustomGame') {

					// show waitingEnterGameDiv
						document.querySelector('#waitingEnterGameDiv').className = 'waitingEnterGameDiv';


					nickname = getNickname(queries);


					let gameId = getGameId(queries);


					// send join attempt with nickname and gameId
						sock.emit('enterGameId', gameId, nickname);


			// if join method is invalid
				} else {

					alert('Sorry, your link is invalid.');

					// send back to join page
						window.open('../../join/join.html', '_self');

				}


		return nickname;

	}