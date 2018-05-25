var signalr = require('@aspnet/signalr');
WebSocket = require('websocket').w3cwebsocket;

class Client {
	constructor(deviceId, socket) {
		this.id = deviceId;
		this.socket = socket;
		this.messages = [];
		this.promises = [];
	}

	connect () {
		var self = this;
		return this.socket.start()
			.catch(err => console.log('error', err.toString()));
	}

	disconnect () {
		return this.socket.stop();
	}

	start (options) {
		var self = this;
		    return new Promise((resolve, reject) => {
		}); 
	}

	on (event, handler) {
		this.socket.on(event, handler);
	}

	echo (message) {
		return this.socket.send('echo', message);
	}
}

module.exports = {
	createClient (url, deviceId) {
		console.log('creating client with id', deviceId, '@', url);
		return new Promise((resolve, reject) => {
			new Promise((resolve, reject) => {
				console.log('getting access token from', url);
                fetch(url + '/generatetoken?deviceId=' + escape(deviceId), {
                    method: 'GET',
                }).then((response) => response.text())
                .then(async (token) => {
                    resolve(token)
                });
			})
			.then(token => {
				console.log('connecting to hub with token', token);
				var socket = new signalr.HubConnectionBuilder()
					.withUrl(url + '/ws', {
						accessTokenFactory: () => token
					})
					.build();
				resolve(new Client(deviceId, socket));
			});
		});
	}
};
