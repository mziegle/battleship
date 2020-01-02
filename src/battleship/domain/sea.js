function Field(x, y) {
    this.x = x;
    this.y = y;
    this.occupied = false;

    this.toString = function() {
        return `(${String.fromCharCode(this.x + 65)}, ${this.y + 1})`;
    }
}

Field.prototype.occupy = function() {
    this.occupied = true;
}

function Grid(size) {
    this.table = new Array(size)

    for (var x = 0; x < size; x++) {
        this.table[x] = new Array(size);
        for (y = 0; y < size; y++) {
            this.table[x][y] = new Field(x, y);
        }
    }
}

function characterToXCoordinate(character) {
    return character.charCodeAt(0) - 65
}

function startFromZero(y) {
    return y - 1;
}

Grid.prototype.getField = function(x, y) {
    this.enforcePositionInGrid(characterToXCoordinate(x), startFromZero(y));

    return this.table[characterToXCoordinate(x)][startFromZero(y)]
}

Grid.prototype.getGridField = function(x, y) {
    if (this.isPositionInGrid(x, y)) {
        return this.table[x][y]
    }

    return undefined;
}

Grid.prototype.setHorizontally = function(positionX, positionY, size) {
    var x = characterToXCoordinate(positionX)
    var y = startFromZero(positionY);

    var fields = this.horizontalFields(x, y, size);

    this.occupyFields(fields);
}

Grid.prototype.setVertically = function(positionX, positionY, size) {
    var x = characterToXCoordinate(positionX)
    var y = startFromZero(positionY);

    var fields = this.verticalFields(x, y, size);

    this.occupyFields(fields);
}

Grid.prototype.occupyFields = function(fields) {
    this.enforceFieldsFree(fields);
    this.enforceAdjacentFieldsFree(fields);
    
    fields.forEach(field => {
        field.occupy();
    });
}

Grid.prototype.enforceFieldsFree = function(fields) {
    fields.forEach(field => {
        if (field.occupied) {
            throw new RangeError(`Area ${field.toString()} is already occupied`);
        }
    });
}

Grid.prototype.enforceAdjacentFieldsFree = function(fields) {
    fields.forEach(field => {
        var top = this.getGridField(field.x, field.y - 1);
        var bottom = this.getGridField(field.x, field.y + 1);
        var left = this.getGridField(field.x - 1, field.y);
        var right = this.getGridField(field.x, field.y + 1);
        var topLeft = this.getGridField(field.x - 1, field.y - 1);
        var topRight = this.getGridField(field.x + 1, field.y - 1);
        var bottomLeft = this.getGridField(field.x - 1, field.y + 1);
        var bottomRight = this.getGridField(field.x + 1, field.y + 1);

        [top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight].forEach(neighbor => {
            if (neighbor && neighbor.occupied) {
                throw new Error(`Adjacent area ${neighbor.toString()} is occupied`);
            }
        })
    });
}

Grid.prototype.horizontalFields = function(x, y, size) {
    var fields = [];
    var end = x + size;
    
    for (; x < end; x++) {
        this.enforcePositionInGrid(x, y);

        fields.push(this.table[x][y]);
    }

    return fields;
}

Grid.prototype.verticalFields = function(x, y, size) {
    var fields = [];
    var end = y + size;
    
    for (; y < end; y++) {
        this.enforcePositionInGrid(x, y);

        fields.push(this.table[x][y]);
    }

    return fields;
}

Grid.prototype.enforcePositionInGrid = function(x, y) {
    if (!this.isPositionInGrid(x, y)) {
        throw new RangeError(`Area ${new Field(x, y).toString()} is not in sea`);
    }
}

Grid.prototype.isPositionInGrid = function(x, y) {
    return x >= 0 && x < this.table.length && y >= 0 && y < this.table.length
}

function Sea() {
    const GRID_SIZE = 10;

    this.grid = new Grid(GRID_SIZE);
    this.ships = {};
}

Sea.prototype.isHit = function(x, y) {
    return this.grid.getField(x, y).occupied;
}

Sea.prototype.placeShip = function(x, y, ship, alignment) {
    if (alignment == ShipAlignment.vertically) {
        this.grid.setVertically(x, y, ship.size);
    } else {
        this.grid.setHorizontally(x, y, ship.size);
    }

    var shipType = ship.type;

    if (this.ships.hasOwnProperty(shipType)) {
        this.ships[shipType].push(ship);
    } else {
        this.ships[shipType] = [ship];
    }
}

Sea.prototype.bombard = function(x, y) {
    if (this.isHit(x, y)) {
        return 'Hit';
    }

    return 'Water';
}

Sea.prototype.shipsByType = function(type) {
    var ships = this.ships[type];

    if (Array.isArray(ships))
        return ships

    return [];
}

const ShipAlignment = {
    horizontally: 1,
    vertically: 2
}

module.exports = {
    Sea: Sea,
    ShipAlignment: ShipAlignment
}