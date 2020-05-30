// connection to socket.io server
const sock = io();

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
			if (nickname == "" | nickname == null) {

				nickname = "Guest";

			}

			// console.log("<nickname> from promt: ", nickname)

		}

		// send mode and nicjkname to server to setup room
		sock.emit('createGameId', nickname)

		// show waitingCustomGameDiv
		document.querySelector('#waitingCustomGameDiv').className = "waitingCustomGameDiv";

		// write nickname in waitingCustomGameNickname
		document.querySelector('#waitingCustomGameNickname').innerHTML = nickname;

	// if first query is invalid
	} else {

		// console.log("<ERROR> invalid queryString")

		// alert user
		alert("Sorry, your link is invalid.")

		// send back to frontpage
		window.open("../../", "_self");

	}

}

// variables
let nickname = "";

// check join method
getMethod();

// write newCustomGameId
function writeNewCustomId(newCustomGameId) {

	// console.log("newCustomGameId: ", newCustomGameId);

	// write newCustomGameId
	document.querySelector('#CustomGameId').innerHTML = newCustomGameId;

}

// on server send newCustomGameId
sock.on('newCustomGameId', writeNewCustomId);