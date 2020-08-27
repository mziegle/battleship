var { ShipAlignment } = require('./ship');
const { Field } = require('./field');
const { DomainError } = require('./error');

class Ship {
    constructor(fields, type) {
        this.fields = fields;
        this.type = type;
    }

    size() {
        return this.fields.length();
    }
}

class ShipPlacement {

    constructor(shipConfigs, gridSize = 10) {
        this.shipConfigs = shipConfigs;
        this.gridSize = gridSize;
        this.ships = [];
    }

    placeShip(column, row, type, alignment) {
        const x = column.charCodeAt(0) - 65;
        const y = row - 1;
        const shipConfig = this.shipConfigs.find(shipConfig => shipConfig.type === type);

        if (!shipConfig) {
            throw new DomainError('No such ship type ' + shipConfig.type)
        }

        if (this.numberShipsOfType(type) >= shipConfig.count) {
            throw new DomainError('Ship type exhausted', {
                type: type,
                permitted: shipConfig.count
            });
        }

        const size = shipConfig.size;
        var fields = [];

        switch (alignment) {
            case ShipAlignment.horizontally:
                fields = this.horizontalFields(x, y, size);
                break;
            case ShipAlignment.vertically:
                fields = this.verticalFields(x, y, size);
                break;
            default:
                new DomainError('No such alignment ' + alignment);
        }

        this.enforceFieldsFree(fields);
        this.enforceAdjacentFieldsFree(fields);
        this.ships.push(new Ship(fields, type));
        return fields.map(field => field.toString());
    }

    getShips() {
        return this.ships.map((ship) => {
            return {
                type: ship.type,
                fields: ship.fields.map(field => field.toString())
            }
        });
    }

    enforceAllShipsPlaced() {
        var details = this.findShipsLeftToPlace();

        if (Object.keys(details).length > 0) {
            throw new DomainError('Not all ships were placed', details);
        }
    }

    findShipsLeftToPlace() {
        return this.shipConfigs.map(shipConfig => {
            return {
                'type': shipConfig.type,
                'leftToPlace': shipConfig.count - this.numberShipsOfType(shipConfig.type)
            }
        })
            .reduce((result, current) => {
                if (current.leftToPlace > 0) {
                    result[current.type] = current.leftToPlace;
                }
                return result;
            }, {});
    }

    numberShipsOfType(type) {
        return this.ships.filter(ship => ship.type === type).length;
    }

    horizontalFields(x, y, size) {
        var fields = [];
        var end = x + size;

        for (; x < end; x++) {
            const field = new Field(x, y);

            this.enforceFieldInGrid(field);
            fields.push(field);
        }

        return fields;
    }

    verticalFields(x, y, size) {
        var fields = [];
        var end = y + size;

        for (; y < end; y++) {
            const field = new Field(x, y);

            this.enforceFieldInGrid(field);
            fields.push(field);
        }

        return fields;
    }

    enforceFieldInGrid(field) {
        if (!this.isFieldInGrid(field)) {
            const fieldName = field.toString();

            throw new DomainError(`Area ${fieldName} is not in sea`, { field: fieldName });
        }
    }

    enforceFieldsFree(fields) {
        fields.forEach(field => {
            if (this.isFieldOccupied(field)) {
                throw new DomainError(`Area ${field.toString()} is already occupied`,
                    { field: field.toString() });
            }
        });
    }

    enforceAdjacentFieldsFree(fields) {
        const occupiedFields = this.getOccupiedFields();

        fields.forEach(field => {
            this.getAdjacentFieldsOf(field).forEach(adjacentField => {
                if (this.isFieldOccupied(adjacentField)) {
                    throw new DomainError(`Adjacent area ${adjacentField.toString()} is occupied`,
                        { adjacentField: adjacentField.toString() });
                }
            })
        });
    }

    isFieldOccupied(field) {
        const occupiedFields = this.getOccupiedFields();

        return Boolean(occupiedFields.find(occupiedField => occupiedField.equals(field)));
    }

    getOccupiedFields() {
        return this.ships.map(ship => ship.fields).flat();
    }

    getAdjacentFieldsOf(field) {
        var top = new Field(field.x, field.y - 1);
        var bottom = new Field(field.x, field.y + 1);
        var left = new Field(field.x - 1, field.y);
        var right = new Field(field.x + 1, field.y);
        var topLeft = new Field(field.x - 1, field.y - 1);
        var topRight = new Field(field.x + 1, field.y - 1);
        var bottomLeft = new Field(field.x - 1, field.y + 1);
        var bottomRight = new Field(field.x + 1, field.y + 1);

        // Make clear it is an undefined check
        return [top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight]
            .filter(field => this.isFieldInGrid(field));
    }

    isFieldInGrid(field) {
        return field.x >= 0 && field.x < this.gridSize && field.y >= 0 && field.y < this.gridSize;
    }
}

module.exports = {
    ShipPlacement: ShipPlacement
}