class SocketioController {
    // TODO import logger
    constructor(server, applicationService) {
        this.io = require('socket.io')(server);
        this.io.origins();
        this.io.on('connection', (socket) => {
            console.log(`${socket.handshake.address} connected`)
            this.initConnection(socket);
        });
        this.applicationService = applicationService;
    }

    initConnection(socket) {
        let gameId;
        let player;
        
        socket.on('subscribe', (event) => {
            // TODO check credentials
            const gameId = parseInt(event.gameId);
            
            this.subscribe(socket, gameId);
        })
        // TODO close socket 
        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }

    subscribe(socket, gameId) {
        try {
            this.applicationService.subscribe(gameId, (event) => {
                socket.emit('game', { type: event.constructor.name, body: event });
            });
        } catch (error) {
            console.log(error);
            socket.close();
        }
    }
}

module.exports = {
    SocketioController: SocketioController
}