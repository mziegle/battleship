
var express = require('express');
var DomainError = require('../domain/error').DomainError;

class RestController {
    
    constructor(applicationService) {
        this.applicationService = applicationService;
        this.httpServer = express();

        this.httpServer.use(express.json());
        this.httpServer.get('/games', (request, response) => this.listGames(request, response));
        this.httpServer.post('/games', (request, response) => this.newGame(request, response));
        this.httpServer.get('/games/:id/state', (request, response) => this.getGameState(request, response));
        this.httpServer.put('/games/:id/:player/sea/:x/:y', (request, response) => this.placeShip(request, response)); 
        this.httpServer.put('/games/:id/state', (request, response) => this.startGame(request, response));
        this.httpServer.delete('/games/:gameId/:player/sea/:row/:column', (request, response) => this.fire(request, response));
    }

    start() {
        const port = 8080;

        this.httpServer.listen(port, () => {
            console.log(`Battleship server is listening on port ${port}`);
        });
    }

    listGames(request, response) {
        response.send('The active game is..');
    }

    newGame(request, response) {
        var player1 = request.body.player1;
        var player2 = request.body.player2;
    
        if (player1 && player2) {
            var gameId = this.applicationService.newGame(player1, player2);
    
            response.setHeader('Location', `/games/${gameId}`);
            response.statusCode = 201;
            response.write(JSON.stringify({
                id: gameId
            }));
    
            response.end();
        } else {
            response.sendStatus(400);
        }
    }

    getGameState(request, response) {
        var gameId = parseInt(request.params.id);
        const state = this.applicationService.gameState(gameId);
    
        response.write(JSON.stringify(state));
        response.statusCode = 200;
        response.end();
    }

    placeShip(request, response) {
        var gameId = parseInt(request.params.id);
        var player = request.params.player;
        var x = request.params.x;
        var y = request.params.y;
        var shipType = request.body.shipType;
        var alignment = request.body.alignment;
    
        try {
            var fields = this.applicationService.placeShip(gameId, player, x, y, shipType, alignment);
        
            response.write(JSON.stringify({
                fields: fields
            }));
        
            response.statusCode = 200;
    
        } catch (error) {
            if (error instanceof DomainError) {
                response.statusCode = 400;
                response.write(error.message);
            } else {
                throw error;
            }
        }
    
        response.end();
    }

    startGame(request, response) {
        var gameId = parseInt(request.params.id);
        var start = request.body.start;
    
        if (start) {
            try {
                this.applicationService.start(gameId);
    
                response.statusCode = 200;
            } catch (error) {
                if (error instanceof DomainError) {
                    response.statusCode = 400;
                    response.write(JSON.stringify({
                        type: error.name,
                        message: error.message,
                        details: error.details
                    }));
                } else {
                    throw error;
                }
            }
        }
    
        response.end();
    }

    fire(request, response) {
        const gameId = parseInt(request.params.gameId);
        const player = request.params.player;
        const row = request.params.row;
        const column = request.params.column;
    
        try {
            var fireResult = this.applicationService.fire(gameId, player, row, column);
            
            response.statusCode = 200;
            response.write(JSON.stringify({
                result: fireResult
            }));
        } catch (error) {
            if (error instanceof DomainError) {
                response.statusCode = 400;
                response.write(JSON.stringify({
                    type: error.name,
                    message: error.message,
                    details: error.details
                }));
            } else {
                throw error;
            }
        }
        
        response.end();
    }
}

module.exports = {
    RestController: RestController
}