var Sea = require('./sea').Sea;
var shipConfigs = require('./ship').shipConfigs;
var DomainError = require('./error').DomainError;

class Player {
    constructor(name, sea) {
        this.name = name;
        this.sea = sea;
    }
}

class Game {

    constructor(namePlayer1, namePlayer2) {
        this.players = {};
        this.players[namePlayer1] = new Player(namePlayer1, new Sea());
        this.players[namePlayer2] = new Player(namePlayer2, new Sea());
        this.activePlayer = this.players[namePlayer1];
        this.inactivePlayer = this.players[namePlayer2];
        this.running = false;
        this.winner = undefined;
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

    placeShip(playerName, row, column, ship, alignment) {
        var fields = [];
    
        if (this.running) {
            throw new DomainError(`The ${ship} cannot be placed, because the game is already running`, {});
        }
    
        var player = this.players[playerName];
        
        if (player) {
            var countShipsPlaced = player.sea.shipsByType(ship.type).length;
    
            if (countShipsPlaced >= ship.count)
            {
                throw new DomainError('Ship type exhausted', {
                    type: ship.type,
                    count: ship.count
                });
            }
    
            fields = player.sea.placeShip(row, column, ship, alignment);
        } else {
            throw new DomainError(`Player ${playerName} is not registered for this game`, {});
        }
    
        return fields;
    }

    start() {

        if (this.winner) {
            throw new DomainError(`The game is over, winner is ${this.winner.name}`, {});
        }
    
        if (this.running) {
            throw new DomainError(`The game is already running`, {});
        }

        this.enforceAllShipsPlaced();
    
        this.running = true;
    }

    enforceAllShipsPlaced() {
        var details;

        [this.activePlayer, this.inactivePlayer].forEach(player => {
            
            var shiptsLeftToBePlaced = this.findShipsLeftToBePlaced(player); 
            
            if (shiptsLeftToBePlaced) {
                if (!details) {
                    details = {};
                }

                details[player.name] = shiptsLeftToBePlaced;
            }
        });

        if (details) {
            throw new DomainError('Not all ships were placed', details);
        }
    }

    findShipsLeftToBePlaced(player) {
        var result;
        
        shipConfigs.forEach(shipConfig => {
            const countShipsPlaced = shipConfig.count - player.sea.shipsByType(shipConfig.type).length;
    
            if (countShipsPlaced > 0) {
                if (!result) {
                    result = {};
                }
                result[shipConfig.type] = countShipsPlaced;
            }
        });

        return result;
    }

    bombard(row, column) {

        if (!this.running) {
            throw new DomainError('The game has not been started yet', {});
        }
    
        if (this.winner) {
            throw new DomainError(`Cannot bombard, game is already won by ${this.winner.name}`,
                { winner: this.winner.name });
        }
        
        var result = {};
        var bombardmentResult = this.inactivePlayer.sea.bombard(row, column);
        
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