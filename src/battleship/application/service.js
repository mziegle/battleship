
var Game = require('../domain/game').Game;
var ShipAlignment = require('../domain/ship').ShipAlignment;
var DomainError = require('../domain/error').DomainError;
var ShipFactory = require('../domain/ship').ShipFactory;

class ApplicationService {

    constructor(allowedShips) {
        this.games = new Map();
        this.counter = 0;
        this.allowedShips = allowedShips;
        this.shipFactory = new ShipFactory(allowedShips); 
    }

    newGame(player1, player2) {
        const game = new Game(player1, player2, this.allowedShips);

        this.games.set(this.counter, game);
        return this.counter++; 
    }

    gameState(gameId) {
        return this.games.get(gameId).getState();
    }

    placeShip(gameId, player, x, y, shipType, shipAlignment) {
        var game = this.games.get(gameId);
        var ship = this.shipFactory.create(shipType);
        var alignment;

        switch (shipAlignment) {
            case 'horizontally':
                alignment = ShipAlignment.horizontally;
                break;
            case 'vertically':
                alignment = ShipAlignment.vertically;
                break;        
            default:
                // TODO Error
                break;
        }

        var fields = game.placeShip(player, x, y, ship, alignment);

        return fields.map(field => field.toString());
    }

    start(gameId) {
        var game = this.games.get(gameId);

        game.start();
    }

    fire(gameId, player, row, column) {
        var game = this.games.get(gameId);

        if (game.getInactivePlayerName() !== player) {
            throw new DomainError(`It's not ${game.getInactivePlayerName()}s turn`, {});
        }

        return game.bombard(row, column);
    }
}

module.exports = {
    ApplicationService: ApplicationService
}