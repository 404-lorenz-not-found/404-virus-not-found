// import
	import {onMethod} from './onMethod.js';
	import {writeGameId, roomFullInvalid, confirmAlert, showGame} from './playController.js';
	import {updateGame} from './update.js';
	import {resizeCanvas} from './resizeCanvas.js';


// connection to socket.io server
	const sock = io();


// on page load
	let nickname = onMethod(sock);


// call writeGameId when server sends newCustomGameId
	sock.on('newCustomGameId', writeGameId);


// call roomFullInvalid when server sends alert that chosen room is eighter full or invalid
	sock.on('roomFullInvalid', roomFullInvalid);


// call confirmAlert when server requests game start confirmation
	sock.on('confirmAlert', (players, gameId) => {
		confirmAlert(players, gameId, nickname, sock);
	});


// call showGame when server starts game
	sock.on('showGame', () => {
		showGame(nickname);
	});


// on resizing of window
	window.addEventListener('resize', resizeCanvas);


// on game update
	sock.on('updateGame', updateGame);