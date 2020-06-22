// sendConfirmAlert
	// "send" confimation alerts to both socks in room with given gameId
	// 
	// Parameters:
	// gameId = gameId of room whoms clients are supposed to get confirmation alert
	// socketNicknames = array of all socks an their nicknames ([[sock.id, nickname], ...])
	// io = "socket.io's io"
	function sendConfirmAlert(gameId, socketNicknames, io) {

		// get socks in room
			io.in(gameId).clients((err, clients) => {

				if (err) {
					console.error('<error><sendConfirmAlert> ' + err);
				}


				// get nicknames from socks in room
					let players = [];

					// go through socketNicknames[] an check for sock.id (clients[0 or 1]) then take nickname
						for (let i = 0; i < socketNicknames.length; i++) {

							if (socketNicknames[i][0] == clients[0] || socketNicknames[i][0] == clients[1]) {

								players.push(socketNicknames[i][1]);

							}

						}


				// "send" confirm game start alert
					io.in(gameId).emit('confirmAlert', players, gameId);

					console.log('<sendConfirmAlert> sent confirmation alerts to socks (', clients, '-', players, ') in room: ' + gameId);

			});

	}


// exporting modules
	module.exports = {
		sendConfirmAlert: sendConfirmAlert
	};