
var Manager = require('./application/manager').Manager;
var DomainError = require('./domain/error').DomainError;
var express = require('express');
var app = express();
var port = 8080;

var manager = new Manager();

app.use(express.json());

app.get('/games', (request, response) => {
    response.send('The active game is..');
});

app.post('/games', (request, response) => {
    var player1 = request.body.player1;
    var player2 = request.body.player2;

    if (player1 && player2) {
        var gameId = manager.newGame(player1, player2);

        response.setHeader('Location', `/games/${gameId}`);
        response.statusCode = 201;
        response.write(JSON.stringify({
            id: gameId
        }));

        response.end();
    } else {
        response.sendStatus(400);
    }
});

app.put('/games/:id/:player/sea/:x/:y', (request, response) => {
    var gameId = parseInt(request.params.id);
    var player = request.params.player;
    var x = request.params.x;
    var y = request.params.y;
    var shipType = request.body.shipType;
    var alignment = request.body.alignment;

    try {
        var fields = manager.placeShip(gameId, player, x, y, shipType, alignment);
    
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
});

app.put('/games/:id/state', (request, response) => {
    var gameId = parseInt(request.params.id);
    var start = request.body.start;

    if (start) {
        try {
            manager.start(gameId);

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
});

app.delete('/games/:gameId/:player/sea/:row/:column', (request, response) => {
    const gameId = parseInt(request.params.gameId);
    const player = request.params.player;
    const row = request.params.row;
    const column = request.params.column;

    try {
        var fireResult = manager.fire(gameId, player, row, column);
        
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
});

app.listen(port, () => {
    console.log(`Battleship server is listening on port ${port}`);
});