function Carrier() {
    this.type = 'Carrier';
    this.size = 5;
    this.count = 1;
}

function Battleship() {
    this.type = 'Battleship';
    this.size = 4;
    this.count = 2;
}

function Destroyer() {
    this.type = 'Destroyer';
    this.size = 3;
    this.count = 3;
}

function Submarine() {
    this.type = 'Submarine';
    this.size = 2;
    this.count = 4;
}

const shipConfigs = [
    { type: 'Carrier', size: 5, count: 1 },
    { type: 'Battleship', size: 4, count: 2 },
    { type: 'Destroyer', size: 3, count: 3 },
    { type: 'Submarine', size: 2, count: 4 }
]

class Ship {
    constructor(type, size, count) {
        this.type = type;
        this.size = size;
        this.count = count;
    }
}

const ShipAlignment = {
    horizontally: 1,
    vertically: 2
}

module.exports = {
    Carrier: Carrier,
    Battleship: Battleship,
    Destroyer: Destroyer,
    Submarine: Submarine,
    ShipAlignment: ShipAlignment,
    shipConfigs: shipConfigs
}