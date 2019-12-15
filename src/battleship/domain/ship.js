function Carrier() {
    this.size = 5;
}

function Battleship() {
    this.size = 4;
}

function Destroyer() {
    this.size = 3;
}

function Submarine() {
    this.size = 2;
}

module.exports = {
    Carrier: Carrier,
    Battleship: Battleship,
    Destroyer: Destroyer,
    Submarine: Submarine
}