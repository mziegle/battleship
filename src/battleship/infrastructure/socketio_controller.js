class SocketioController {
    constructor(server, applicationService) {
        this.io = require('socket.io')(server);
        this.io.on('connection', (socket) => {
            console.log(`${socket.handshake.address} connected`)
            this.initConnection(socket);
        });
        this.applicationService = applicationService;
    }

    initConnection(socket) {
        socket.on('subscribe', (event) => {
            const gameId = event.gameId;

            this.subscribe(socket, gameId);
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    subscribe(socket, gameId) {
        this.applicationService.subscribe(gameId, (event) => {
            socket.emit('game', { type: event.constructor.name, body: event });
        });
    }
}

module.exports = {
    SocketioController: SocketioController
}