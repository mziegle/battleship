var DomainError = require('./error').DomainError;

class ShipFactory {
    constructor(shipConfig) {
        this.shipConfig = shipConfig;
    }

    create(shipType) {
        const matchingShipConfig = this.shipConfig.find(shipConfig => shipConfig.type === shipType);

        if (!matchingShipConfig) {
            throw new DomainError(`Unknown ship type`, {unknownShipType: shipType, availableShipTypes: this.shipConfig});
        }

        return new Ship(matchingShipConfig.type, matchingShipConfig.size, matchingShipConfig.count);
    }
}

class Ship {
    constructor(type, size, permittedNumber) {
        this.type = type;
        this.size = size;
        this.permittedNumber = permittedNumber;
    }
}

const ShipAlignment = {
    horizontally: 1,
    vertically: 2
}

module.exports = {
    ShipFactory: ShipFactory,
    ShipAlignment: ShipAlignment,
    Ship: Ship
}