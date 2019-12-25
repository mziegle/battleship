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

module.exports = {
    Carrier: Carrier,
    Battleship: Battleship,
    Destroyer: Destroyer,
    Submarine: Submarine
}