
var Game = require('../domain/game').Game;
var ShipAlignment = require('../domain/ship').ShipAlignment;
var DomainError = require('../domain/error').DomainError;
var ShipFactory = require('../domain/ship').ShipFactory;

class ApplicationService {

    constructor(allowedShips, playerRepository) {
        this.games = new Map();
        this.counter = 0;
        this.allowedShips = allowedShips;
        this.shipFactory = new ShipFactory(allowedShips); 
        this.playerRepository = playerRepository;
    }

    registerPlayer(name) {
        this.playerRepository.add(name);
    }

    newGame(player1, player2) {
        this.playerRepository.add(player1);
        this.playerRepository.add(player2);

        const game = new Game(this.playerRepository.get(player1), 
            this.playerRepository.get(player2), this.allowedShips);

        this.games.set(this.counter, game);
        return this.counter++;
    }

    gameState(gameId) {
        return this.games.get(gameId).getState();
    }

    placeShip(playerName, x, y, shipType, shipAlignment) {
        var player = this.playerRepository.get(playerName);
        var ship = this.shipFactory.create(shipType);
        var alignment;

        switch (shipAlignment) {
            case 'horizontally':
            case 'horizontal':
                alignment = ShipAlignment.horizontally;
                break;
            case 'vertically':
            case 'vertical':
                alignment = ShipAlignment.vertically;
                break;        
            default:
                // TODO Error
                break;
        }

        var fields = player.placeShip(x, y, ship, alignment);

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

        return game.fire(row, column);
    }
}

module.exports = {
    ApplicationService: ApplicationService
}