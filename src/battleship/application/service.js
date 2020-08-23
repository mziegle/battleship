var DomainError = require('../domain/error').DomainError;
var GameRepository = require('./game_repository').GameRepository;
var PlayerRepository = require('./player_repository').PlayerRepository;
var ShipFactory = require('../domain/ship').ShipFactory;

class ApplicationService {

    constructor(shipConfig) {
        this.gameRepository = new GameRepository();
        this.shipFactory = new ShipFactory(shipConfig); 
        this.playerRepository = new PlayerRepository(shipConfig);;
    }

    registerPlayer(playerName) {
        this.playerRepository.add(playerName);
    }

    listPlayers() {
        return this.playerRepository.list();
    }

    placeShip(playerName, x, y, shipType, shipAlignment) {
        var player = this.playerRepository.get(playerName);
        var ship = this.shipFactory.create(shipType);
        var fields = player.placeShip(x, y, ship, shipAlignment);

        return fields.map(field => field.toString());
    }

    createGame(playerName) {
        const player = this.playerRepository.get(playerName);
        const gameId = this.gameRepository.create(player);

        return gameId;
    }

    listGames() {
        return this.gameRepository.list();
    }

    gameState(gameId) {
        return this.gameRepository.get(gameId).getState();
    }

    join(gameId, playerName) {
        const player = this.playerRepository.get(playerName);
        const game = this.gameRepository.get(gameId);

        game.join(player);
        game.start();
    }

    fireAt(gameId, target, row, column) {
        var game = this.gameRepository.get(gameId);

        return game.fireAt(target, row, column);
    }
}

module.exports = {
    ApplicationService: ApplicationService
}