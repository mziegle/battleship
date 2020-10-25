export default class GridModel {
  constructor(size) {
    this.rows = [];

    for (var x = 0; x < size; x++) {
      this.rows.push(new RowModel(x, size));
    }
  }

  setShip(coordinates) {
    coordinates.forEach(coordinate => {
      var result = parseCoordinate(coordinate);

      this.getField(result.x, result.y).occupy();
    });
  }

  hit(coordinate) {
    var result = parseCoordinate(coordinate);

    this.getField(result.x, result.y).hit();
  }

  miss(coordinate) {
    var result = parseCoordinate(coordinate);

    this.getField(result.x, result.y).water();
  }

  clear() {
    for (var row of this.rows) {
      for (var field of row.fields) {
        field.clear();
      }
    }
  }

  getField(x, y) {
    return this.rows[x].fields[y];
  }

  getVerticalFields(x, y, size) {
    var fields = [];
    var end = x + size;

    for (; x < end && end <= this.rows.length; x++) {
      fields.push(this.getField(x, y));
    }
    return fields;
  }

  getHorizonalFields(x, y, size) {
    var fields = [];
    var end = y + size;

    for (; y < end && end <= this.rows.length; y++) {
      fields.push(this.getField(x, y));
    }
    return fields;
  }
}

// TODO make one Object
export class RowModel {
  constructor(index, size) {
    this.index = index;
    this.fields = [];

    for (var y = 0; y < size; y++) {
      this.fields.push(new FieldModel(index, y));
    }
  }
}

export class FieldModel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.value = "";
    this.selected = false;
  }

  isSet() {
    return Boolean(this.value);
  }

  hit() {
    this.value = "{X}";
  }

  water() {
    this.value = "-";
  }

  occupy() {
    this.value = "X";
  }

  clear() {
    this.value = "";
  }

  select() {
    this.selected = true;
  }

  unselect() {
    this.selected = false;
  }
}

function parseCoordinate(coordinate) {
  const match = coordinate.match(/([A-Z]+)([0-9]+)/);
  const column = match[1];
  const row = match[2];
  const x = row - 1;
  const y = column.charCodeAt() - "A".charCodeAt();

  return { x: x, y: y };
}