var { ShipPlacement } = require('./ship_placement');

class Player {
    constructor(name, password, allowedShips) {
        this.name = name;
        this.password = password;
        this.allowedShips = allowedShips;
        this.shipPlacement = new ShipPlacement(allowedShips);
    }

    placeShip(row, column, ship, alignment) {
        var fields = this.shipPlacement.placeShip(row, column, ship, alignment);
    
        return fields;
    }

    getShips() {
        return this.shipPlacement.getShips();
    }

    removeShips() {
        this.shipPlacement = new ShipPlacement(this.allowedShips);
    }

    enforceAllShipsPlaced() {
        this.shipPlacement.enforceAllShipsPlaced();
    }
}

module.exports = {
    Player: Player
}