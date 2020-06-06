var Sea = require('./sea').Sea;
var DomainError = require('./error').DomainError;

class Player {
    constructor(name, allowedShips) {
        this.name = name;
        this.allowedShips = allowedShips;
        this.sea = new Sea();
    }

    placeShip(row, column, ship, alignment) {
        var numberOfShipsPlaced = this.sea.amountShipsOfType(ship.type);
        
        if (numberOfShipsPlaced >= ship.permittedNumber)
        {
            throw new DomainError('Ship type exhausted', {
                type: ship.type,
                count: ship.permittedNumber
            });
        }
    
        var fields = this.sea.placeShip(row, column, ship, alignment);
    
        return fields;
    }

    enforceAllShipsPlaced() {
        var details = [{
            'player': this.name,
            'shipsLeftToPlace': this.findShipsLeftToPlace()
        }]
        .reduce((details, current) => {
            if (Object.keys(current.shipsLeftToPlace).length > 0)
                details[current.player] = current.shipsLeftToPlace;
            return details;
        }, {});

        if (Object.keys(details).length > 0) {
            throw new DomainError('Not all ships were placed', details);
        }
    }

    findShipsLeftToPlace(player) {
        return this.allowedShips.map(shipConfig => {
            return {
                'type': shipConfig.type,
                'shipsLeftToPlace': shipConfig.count - this.sea.amountShipsOfType(shipConfig.type)
            }
        })
        .reduce((result, current) => {
            if (current.shipsLeftToPlace > 0) {
                result[current.type] = current.shipsLeftToPlace;
            }
            return result;
        }, {});
    }
}

module.exports = {
    Player: Player
}