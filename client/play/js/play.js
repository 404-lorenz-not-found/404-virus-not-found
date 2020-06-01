// connection to socket.io server
const sock = io();


function getNickname(queries) {

	// loop through quieries
	for (let i = 1; i < queries.length; i++) {

		// get possibleNicknameQuery
		let possibleNicknameQuery = queries[i].split("=");

		// check if possibleNicknameQuery is a nickname query
		if (possibleNicknameQuery[0] = "nickname") {

			nickname = possibleNicknameQuery[1];

			// console.log("<nickname> from queryString: ", nickname)

			break;

		}

	}

	// if nickname is "" either from invalid queryString or not defined
	if (nickname == "") {
		
		// ask for nickname
		nickname = prompt("Please choose a nickname:", "Guest");

		// set nickname to "Guest" if nickname is not given
		if (nickname == "" || nickname == null) {

			nickname = "Guest";

		}

		// console.log("<nickname> from promt: ", nickname)

	}

}


function getGameId(queries, enterGameId) {

	// loop through quieries
	for (let i = 1; i < queries.length; i++) {

		// get possibleGameIdQuery
		let possibleGameIdQuery = queries[i].split("=");

		// check if possibleGameIdQuery is a gameId query
		if (possibleGameIdQuery[0] = "gameId") {

			enterGameId = possibleGameIdQuery[1];

			break;

		}

	}

	// if gameId is "" either from invalid queryString or not defined
	if (enterGameId == "") {
		
		// ask for enterGameId
		enterGameId = prompt("Please enter the code you were given:");

		// link to menu when gameId is not given or not an 8 digit code
		if (enterGameId == "" || enterGameId == null || enterGameId.length != 8) {

			alert("Invalid code");

			// send back to join page
			window.open("../../join/join.html", "_self");

		}

	}

	return enterGameId;

}


// check join method
function getMethod() {

	// parse queryString

		let queryString = decodeURIComponent(window.location.search);
		queryString = queryString.substring(1);

		const queries = queryString.split("&");

	// get join method
	const methodQuery = queries[0].split("=");

	// check join method
	if (methodQuery[1] == "createCustomGame") {

		// console.log("<method> createCustomGame");

		getNickname(queries);

		// send mode and nicjkname to server to setup room
		sock.emit('createGameId', nickname)

		// show waitingCustomGameDiv
		document.querySelector('#waitingCustomGameDiv').className = "waitingCustomGameDiv";

		// write nickname in waitingCustomGameNickname
		document.querySelector('#waitingCustomGameNickname').innerHTML = nickname;

	} else if (methodQuery[1] == "enterCustomGame") {

		let enterGameId = "";

		getNickname(queries);

		enterGameId = getGameId(queries, enterGameId);

		sock.emit('enterGameId', enterGameId, nickname);

		// show waitingEnterGameDiv
		document.querySelector('#waitingEnterGameDiv').className = "waitingEnterGameDiv";

	// if first query is invalid
	} else {

		// console.log("<ERROR> invalid queryString")

		alert("Sorry, your link is invalid.");

		// send back to join page
		window.open("../../join/join.html", "_self");

	}

}


// variables
	let nickname = "";
	let opponent = "";
	let gameId = "";


// check join method
getMethod();


// on server send newCustomGameId write newCustomGameId
sock.on('newCustomGameId', (newCustomGameId) => {

	// console.log("newCustomGameId: ", newCustomGameId);

	// write newCustomGameId
	document.querySelector('#CustomGameId').innerHTML = newCustomGameId;

});


// on server send code invalid
sock.on('roomFullInvalid', (invalidCode) => {

	alert("Sorry, the game with the chosen code '" + invalidCode + "' either does not exist or is full.");

	// send back to join page
	window.open("../../join/join.html", "_self");

});


sock.on('startGame', (players, gameId) => {

	// console.log(players);

	// hide waitingCustomGameDiv
	document.querySelector('#waitingCustomGameDiv').className = "hidden";

	// hide waitingEnterGameDiv
	document.querySelector('#waitingEnterGameDiv').className = "hidden";

	// show waitingForOpponentDiv
	document.querySelector('#waitingForOpponentDiv').className = "waitingForOpponentDiv";

	// parse opponent from players
	if (players[0] == nickname) {

		opponent = players[1];

	} else if (players[1] == nickname) {

		opponent = players[0];

	}

	alert("Please confirm the start of the game against " + opponent + ".\nHave fun!");

	// console.log("<game start> confirmation sent");

	sock.emit('confirmStart', gameId);

});


sock.on('showGame', () => {

	// hide waitingForOpponentDiv
	document.querySelector('#waitingForOpponentDiv').className = "hidden";

	// show gameContainer
	document.querySelector('#gameContainer').className = "gameContainer";
	
});