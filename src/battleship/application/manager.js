
var Game = require('../domain/game').Game;
var Carrier = require('../domain/ship').Carrier;
var Battleship = require('../domain/ship').Battleship;
var Destroyer = require('../domain/ship').Destroyer;
var Submarine = require('../domain/ship').Submarine;
var ShipAlignment = require('../domain/ship').ShipAlignment;
var DomainError = require('../domain/error').DomainError;

class Manager {
    constructor() {
        this.games = new Map();
        this.counter = 0;
    }

    newGame(player1, player2) {
        this.games.set(this.counter, new Game(player1, player2));

        return this.counter++; 
    }

    placeShip(gameId, player, x, y, shipType, shipAlignment) {
        var game = this.games.get(gameId);
        var ship;
        var alignment;

        switch (shipType) {
            case 'carrier':
                ship = new Carrier();
                break;
            case 'battleship':
                ship = new Battleship();
                break;
            case 'destroyer':
                ship = new Destroyer();
                break;
            case 'submarine':
                ship = new Submarine();
                break;
            default:
                // TODO Error
                break;
        }

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
    Manager: Manager
}