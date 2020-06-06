var Sea = require('./sea').Sea;
var DomainError = require('./error').DomainError;
var Player = require('./player').Player;

class Game {
    constructor(player1, player2) {
        this.players = {};
        this.players[player1.name] = player1;
        this.players[player2.name] = player2;
        this.activePlayer = player1;
        this.inactivePlayer = player2;
        this.running = false;
        this.winner = undefined;
    }

    getState() {
        var result = {
            running: this.running,
            activePlayer: this.getActivePlayerName(),
            inactivePlayer: this.getInactivePlayerName()
        }

        if (this.winner) {
            result.winner = this.winner.name;
        }

        return result;
    }

    getInactivePlayerName() {
        return this.inactivePlayer.name;
    }

    getActivePlayerName() {
        return this.activePlayer.name;
    }

    switchPlayers() {
        var tmp = this.activePlayer;
        this.activePlayer = this.inactivePlayer;
        this.inactivePlayer = tmp;
    }

    start() {
        if (this.running) {
            throw new DomainError(`The game is already running`, {});
        }
        if (this.winner) {
            throw new DomainError(`The game is over, winner is ${this.winner.name}`, { 
                winner: this.winner.name });
        }
        this.activePlayer.enforceAllShipsPlaced();
        this.inactivePlayer.enforceAllShipsPlaced();
        this.running = true;
    }

    fire(row, column) {

        if (!this.running) {
            throw new DomainError('The game has not been started yet', {});
        }
    
        if (this.winner) {
            throw new DomainError(`Cannot fire, game is already won by ${this.winner.name}`,
                { winner: this.winner.name });
        }
        
        var result = {};
        var bombardmentResult = this.inactivePlayer.sea.fire(row, column);
        
        if (this.inactivePlayer.sea.allShipsSunk()) {
            this.winner = this.activePlayer;
            result.winner = this.winner.name;
        }

        switch (bombardmentResult) {
            case 'hit':
                break;
    
            case 'water':
            case 'sunk':
                this.switchPlayers();
                break;
        }
    
        result.hits = bombardmentResult;

        return result;
    }
}

module.exports = {
    Game: Game
}