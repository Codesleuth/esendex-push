function ClientList() {
	this.clients = [];
}

ClientList.prototype.add = function (request, response) {
	client = { req: request, res: response };
	this.clients.push(client);
	return client;
}
ClientList.prototype.count = function () {
	return this.clients.length;
}
ClientList.prototype.remove = function (client) {
	var index = this.clients.indexOf(client);
    if (index > -1) {
        this.clients.splice(index, 1);
    }
}
ClientList.prototype.each = function (callback) {
	var clients = this.clients.slice(0, this.clients.length);
	for (var i = 0; i < clients.length; i++) {
		try {
			callback(clients[i]);
		} catch (e) {}
	}
}

module.exports = ClientList;