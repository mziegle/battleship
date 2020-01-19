
var Manager = require('./application/manager').Manager;
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
        
        response.statusCode = 400;
        response.write(error.message);
    }

    response.end();
});

app.delete('/games/:id/:x/:y', (request, response) => {
    request.params.id;
    request.params.x;
    request.params.y;
});

app.listen(port, () => {
    console.log(`Battleship server is listening on port ${port}`);
});