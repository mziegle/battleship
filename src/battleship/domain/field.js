class Field {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `${String.fromCharCode(this.x + 65)}${this.y + 1}`;
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

module.exports = {
    Field: Field
}