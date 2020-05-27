const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = `${__dirname}/../client`;

console.log(`<server> serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

server.on('error', (err) => {
	console.error('<ERROR> ', err);
});

server.listen(80, () => {
	console.log('<server> server started');
});