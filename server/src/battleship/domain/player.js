var { Fleet } = require('./fleet');

class Player {
    constructor(name, password, allowedShips) {
        this.name = name;
        this.password = password;
        this.allowedShips = allowedShips;
        this.fleet = new Fleet(allowedShips);
    }

    placeShip(row, column, ship, alignment) {
        var fields = this.fleet.placeShip(row, column, ship, alignment);
    
        return fields;
    }

    getShips() {
        return this.fleet.getShips();
    }

    removeShips() {
        this.fleet = new Fleet(this.allowedShips);
    }

    enforceAllShipsPlaced() {
        this.fleet.enforceAllShipsPlaced();
    }
}

module.exports = {
    Player: Player
}