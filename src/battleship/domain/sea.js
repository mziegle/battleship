function Field() {
    this.occupied = false;
}

Field.prototype.occupy = function() {
    this.occupied = true;
}

function Grid(size) {
    this.table = new Array(size)

    for (i = 0; i < size; i++) {
        this.table[i] = new Array(size);
        for (j = 0; j < size; j++) {
            this.table[i][j] = new Field();
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
    this.enforcePositionInGrid(x, y);

    return this.table[characterToXCoordinate(x)][startFromZero(y)]
}

Grid.prototype.setHorizontally = function(positionX, positionY, length) {
    this.enforcePositionInGrid(positionX, positionY);

    x = characterToXCoordinate(positionX)
    y = startFromZero(positionY);
    end = x + length;

    for (; x < end; x++) {
        this.table[x][y].occupy();
    }
}

Grid.prototype.setVertically = function(positionX, positionY, length) {
    this.enforcePositionInGrid(positionX, positionY);

    x = characterToXCoordinate(positionX)
    y = startFromZero(positionY);
    end = y + length;

    for (; y < end; y++) {
        this.table[x][y].occupy();
    }
}

Grid.prototype.enforcePositionInGrid = function(x, y) {
    if (!this.isPositionInGrid(x, y)) {
        throw new RangeError(`Area (${x}, ${y}) is not in sea`);
    }
}

Grid.prototype.isPositionInGrid = function(x, y) {
    x = characterToXCoordinate(x)
    y = startFromZero(y);

    return x >= 0 && x < this.table.length && y >= 0 && y < this.table.length
}

function Sea() {
    const GRID_SIZE = 10;

    this.grid = new Grid(GRID_SIZE)
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
}

const ShipAlignment = {
    horizontally: 1,
    vertically: 2
}

module.exports = {
    Sea: Sea,
    ShipAlignment: ShipAlignment
}