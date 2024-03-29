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

let createField = function(row, column) {
    const x = column.charCodeAt(0) - 65;
    const y = row - 1;

    return new Field(x, y);
}

module.exports = {
    Field: Field,
    createField: createField,
}