// import
	import {resizeCanvas} from './resizeCanvas.js';
	import {draw} from './update.js';


// "global" variables
	let opponent = '';


// writeGameId
	// writes gameId to clients page
	// 
	// Parameters:
	// gameId = gameId
	export function writeGameId(gameId) {
		// write gameId to clients page
			document.querySelector('#CustomGameId').innerHTML = gameId;
	}


// roomFullInvalid
	// alerts client that chosen room is eighter full or invalid
	// 
	// Parameters:
	// invalidCode = (entered invalid) gameId
	export function roomFullInvalid(invalidCode) {

		alert('Sorry, the game with the chosen code ' + invalidCode + ' either does not exist or is full.');

		// send back to join page
			window.open('../../join/join.html', '_self');

	}


// confirmAlert
	// alerts client that game is about to start and waits for confirmation
	// 
	// Parameters:
	// players = array with nickname of both players
	// gameId = gameId
	// nickname = clients nickname
	// sock = client sock
	export function confirmAlert(players, gameId, nickname, sock) {

		// hide waitingCustomGameDiv
			document.querySelector('#waitingCustomGameDiv').className = 'hidden';

		// hide waitingEnterGameDiv
			document.querySelector('#waitingEnterGameDiv').className = 'hidden';

		// show waitingForOpponentDiv
			document.querySelector('#waitingForOpponentDiv').className = 'waitingForOpponentDiv';


		// parse opponent from players[]
			if (players[0] == nickname) {

				opponent = players[1];

			} else if (players[1] == nickname) {

				opponent = players[0];

			}


		alert('Please confirm the start of the game against ' + opponent + '.\nHave fun!');


		sock.emit('startGame', gameId);

	}


// showGame
	// starts drawing game on clients side
	// 
	// Parameters:
	// nickname = clients nickname
	export function showGame(nickname) {

		// hide waitingForOpponentDiv
			document.querySelector('#waitingForOpponentDiv').className = 'hidden';

		// show gameContainer
			document.querySelector('#gameContainer').className = 'gameContainer';


		// timer game played for clients page
			// seconds
			let timePlayed = 0;

			setInterval(function(){ // setInterval is not best use for timers, but since it is only cosmetic it is accurate enough. ~ Lorenz

				let timePlayedRemaining = timePlayed;

				let hoursPlayed = Math.floor(timePlayed / 3600);
				timePlayedRemaining -= hoursPlayed * 3600;

				let minutesPlayed = Math.floor(timePlayedRemaining / 60);
				timePlayedRemaining -= minutesPlayed * 60;

				if (hoursPlayed.toString().length < 2) {
					hoursPlayed = '0' + hoursPlayed;
				}

				if (minutesPlayed.toString().length < 2) {
					minutesPlayed = '0' + minutesPlayed;
				}

				if (timePlayedRemaining.toString().length < 2) {
					timePlayedRemaining = '0' + timePlayedRemaining;
				}

				document.getElementById('timePlayed').innerHTML = hoursPlayed + ':' + minutesPlayed + ':' + timePlayedRemaining;

				timePlayed ++;

			}, 1000);


		// show nicknames
			document.getElementById('playerInfoNickname').innerHTML = nickname;
			document.getElementById('OpponentPlayerInfoNickname').innerHTML = opponent;


		// '"et" canvas
			resizeCanvas();


		// call draw() to draw first frame (draw() calls itself)
			draw();

	}