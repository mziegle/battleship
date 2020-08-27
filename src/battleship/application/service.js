const game = require('../domain/game');

var DomainError = require('../domain/error').DomainError;
var GameRepository = require('./game_repository').GameRepository;
var PlayerRepository = require('./player_repository').PlayerRepository;
var ShipFactory = require('../domain/ship').ShipFactory;

class ApplicationService {

    constructor(shipConfigs) {
        this.shipConfigs = shipConfigs;
        this.shipFactory = new ShipFactory(shipConfigs); 
        this.playerRepository = new PlayerRepository(shipConfigs);;
        this.gameRepository = new GameRepository();
    }

    registerPlayer(playerName, password) {
        this.playerRepository.add(playerName, password);
    }

    login(playerName, password) {
        const player = this.playerRepository.get(playerName);
        
        if (player.password !== password) {
            throw new DomainError(`Password for player ${playerName} is wrong`);
        }
    }

    getShipConfig() {
        return this.shipConfigs;
    }

    listPlayers() {
        return this.playerRepository.list();
    }

    placeShip(playerName, x, y, shipType, shipAlignment) {
        var player = this.playerRepository.get(playerName);
        var fields = player.placeShip(x, y, shipType, shipAlignment);

        return fields;
    }

    removeShip(playerName, x, y) {
        // TODO
    }

    getShips(playerName) {
        var player = this.playerRepository.get(playerName);

        return player.getShips();
    }

    removeShips(playerName) {
        var player = this.playerRepository.get(playerName);

        return player.removeShips();
    }

    createGame(playerName) {
        const player = this.playerRepository.get(playerName);
        const gameId = this.gameRepository.create(player);

        return gameId;
    }

    quitGame(gameId) {
        this.gameRepository.remove(gameId);
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
    }

    fireAt(gameId, target, row, column) {
        var game = this.gameRepository.get(gameId);

        return game.fireAt(target, row, column);
    }
}

module.exports = {
    ApplicationService: ApplicationService
}