var ShipAlignment = require('./ship').ShipAlignment;
var DomainError = require('./error').DomainError;

const GRID_SIZE = 10;

class Sea {
    
    constructor() {
        this.grid = new Grid(GRID_SIZE);
        this.ships = {};
    }

    isHit(x, y) {
        return this.grid.getField(x, y).occupied;
    }
    
    destroy(x, y) {
        return this.grid.getField(x, y).free();
    }
    
    isShipSunk(x, y) {
        var adjacentFields = this.grid.getAdjacentFields(this.grid.getField(x, y));
    
        return adjacentFields.find(field => field.occupied) === undefined;
    }
    
    placeShip(x, y, ship, alignment) {
        var fields = [];
    
        if (alignment == ShipAlignment.vertically) {
            fields = this.grid.setVertically(x, y, ship.size);
        } else {
            fields = this.grid.setHorizontally(x, y, ship.size);
        }
    
        var shipType = ship.type;
    
        if (this.ships.hasOwnProperty(shipType)) {
            this.ships[shipType].push(ship);
        } else {
            this.ships[shipType] = [ship];
        }
    
        return fields;
    }
    
    bombard(x, y) {
        if (this.isHit(x, y)) {
            
            this.destroy(x, y);
    
            if (this.isShipSunk(x, y)) {
                return 'sunk';
            }
    
            return 'hit';
        }
    
        return 'water';
    }
    
    shipsByType(type) {
        var ships = this.ships[type];
    
        if (Array.isArray(ships)) {
            return ships
        }
    
        return [];
    }
    
    allShipsSunk() {
        for (var i = 0; i < this.grid.table.length; i++) {
            for (var j = 0; j < this.grid.table[i].length; j++) {
                if (this.grid.table[i][j].occupied) {
                    return false;
                }
            }
        }
    
        return true;
    }
}

class Grid {

    constructor(size) {
        this.table = new Array(size)

        for (var x = 0; x < size; x++) {
            this.table[x] = new Array(size);
            for (var y = 0; y < size; y++) {
                this.table[x][y] = new Field(x, y);
            }
        }
    }

    getField(x, y) {
        this.enforcePositionInGrid(characterToXCoordinate(x), startFromZero(y));
    
        return this.table[characterToXCoordinate(x)][startFromZero(y)]
    }

    getGridField(x, y) {
        if (this.isPositionInGrid(x, y)) {
            return this.table[x][y]
        }
    
        return undefined;
    }

    setHorizontally(positionX, positionY, size) {
        var x = characterToXCoordinate(positionX)
        var y = startFromZero(positionY);
    
        var fields = this.horizontalFields(x, y, size);
    
        this.occupyFields(fields);
    
        return fields;
    }
    
    setVertically(positionX, positionY, size) {
        var x = characterToXCoordinate(positionX)
        var y = startFromZero(positionY);
    
        var fields = this.verticalFields(x, y, size);
    
        this.occupyFields(fields);
    
        return fields;
    }

    occupyFields(fields) {
        this.enforceFieldsFree(fields);
        this.enforceAdjacentFieldsFree(fields);
        
        fields.forEach(field => {
            field.occupy();
        });
    }
    
    enforceFieldsFree(fields) {
        fields.forEach(field => {
            if (field.occupied) {
                throw new DomainError(`Area ${field.toString()} is already occupied`, 
                    { field: field.toString() });
            }
        });
    }
    
    enforceAdjacentFieldsFree(fields) {
        fields.forEach(field => {
            this.getAdjacentFields(field).forEach(neighbor => {
                if (neighbor.occupied) {
                    throw new DomainError(`Adjacent area ${neighbor.toString()} is occupied`, 
                        { neighbor: neighbor.toString() });
                }
            })
        });
    }
    
    getAdjacentFields(field) {
        var top = this.getGridField(field.x, field.y - 1);
        var bottom = this.getGridField(field.x, field.y + 1);
        var left = this.getGridField(field.x - 1, field.y);
        var right = this.getGridField(field.x + 1, field.y);
        var topLeft = this.getGridField(field.x - 1, field.y - 1);
        var topRight = this.getGridField(field.x + 1, field.y - 1);
        var bottomLeft = this.getGridField(field.x - 1, field.y + 1);
        var bottomRight = this.getGridField(field.x + 1, field.y + 1);
    
        // Make clear it is an undefined check
        return [top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight]
            .filter(neighbor => neighbor);
    }
    
    horizontalFields(x, y, size) {
        var fields = [];
        var end = x + size;
        
        for (; x < end; x++) {
            this.enforcePositionInGrid(x, y);
    
            fields.push(this.table[x][y]);
        }
    
        return fields;
    }
    
    verticalFields(x, y, size) {
        var fields = [];
        var end = y + size;
        
        for (; y < end; y++) {
            this.enforcePositionInGrid(x, y);
    
            fields.push(this.table[x][y]);
        }
    
        return fields;
    }
    
    enforcePositionInGrid(x, y) {
        if (!this.isPositionInGrid(x, y)) {
            const fieldName = new Field(x, y).toString();

            throw new DomainError(`Area ${fieldName} is not in sea`, { field: fieldName});
        }
    }
    
    isPositionInGrid(x, y) {
        return x >= 0 && x < this.table.length && y >= 0 && y < this.table.length
    }
}

class Field {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.occupied = false;
    }

    toString() {
        return `${String.fromCharCode(this.x + 65)}${this.y + 1}`;
    }

    occupy() {
        this.occupied = true;
    }
    
    free() {
        this.occupied = false;
    }
}

function characterToXCoordinate(character) {
    return character.charCodeAt(0) - 65
}

function startFromZero(y) {
    return y - 1;
}

module.exports = {
    Sea: Sea,
    ShipAlignment: ShipAlignment
}