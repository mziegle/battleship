var Sea = require('./sea').Sea;
var DomainError = require('./error').DomainError;

class Player {
    constructor(name, sea) {
        this.name = name;
        this.sea = sea;
    }
}

class Game {
    constructor(namePlayer1, namePlayer2, allowedShips) {
        this.players = {};
        this.players[namePlayer1] = new Player(namePlayer1, new Sea());
        this.players[namePlayer2] = new Player(namePlayer2, new Sea());
        this.allowedShips = allowedShips;
        this.activePlayer = this.players[namePlayer1];
        this.inactivePlayer = this.players[namePlayer2];
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

    placeShip(playerName, row, column, ship, alignment) {
        var fields = [];
    
        if (this.running) {
            throw new DomainError(`The ${ship} cannot be placed, because the game is already running`, {});
        }
    
        var player = this.players[playerName];
        
        if (player) {
            var numberOfShipsPlaced = player.sea.shipsByType(ship.type).length;
            
            if (numberOfShipsPlaced >= ship.permittedNumber)
            {
                throw new DomainError('Ship type exhausted', {
                    type: ship.type,
                    count: ship.permittedNumber
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
            var shipsLeftToBePlaced = this.findShipsLeftToBePlaced(player); 
            
            if (shipsLeftToBePlaced) {
                if (!details) {
                    details = {};
                }
                details[player.name] = shipsLeftToBePlaced;
            }
        });

        if (details) {
            throw new DomainError('Not all ships were placed', details);
        }
    }

    findShipsLeftToBePlaced(player) {
        var result;
        
        this.allowedShips.forEach(shipConfig => {
            const numberOfShipsPlaced = shipConfig.count - player.sea.shipsByType(shipConfig.type).length;
    
            if (numberOfShipsPlaced > 0) {
                if (!result) {
                    result = {};
                }
                result[shipConfig.type] = numberOfShipsPlaced;
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