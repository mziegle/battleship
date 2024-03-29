const { createField } = require("./field");

class Ship {
    constructor(fields) {
        this.fields = fields;
        this.hits = [];
    }

    fireAt(target) {
        var isHit = this.fields.find(field => field.equals(target));

        if (isHit) {
            var hasAlreadyBeenHit = this.hits.find(field => field.equals(target));

            if (!hasAlreadyBeenHit) {
                this.hits.push(target);
            }

            return true;
        }

        return false;
    }

    isSunk() {
        return this.fields.length === this.hits.length;
    }
}

class Sea {
    constructor(placedShips) {
        this.ships = placedShips.map(placedShip => new Ship([...placedShip.fields]));
        this.misses = [];
    }

    fireAt(column, row) {
        const target = createField(row, column);

        for (const ship of this.ships) {
            if (ship.fireAt(target)) {
                if (ship.isSunk()) {
                    return 'sunk';
                }
                return 'hit';
            }
        }

        const hasAlreadyBeenHit = this.misses.find(field => field.equals(target));

        if (!hasAlreadyBeenHit) {
            this.misses.push(target);
        }

        return 'water';
    }

    getBombedFields() {
        return {
            misses: this.getMisses(),
            hits: this.getHits()
        }
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }

    getMisses() {
        return this.misses.map(field => field.toString());
    }

    getHits() {
        return this.ships.map(ship => ship.hits.map(field => field.toString())).flat();
    }
}

module.exports = {
    Sea: Sea
}