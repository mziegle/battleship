var should = require('chai').should()
const assert = require('assert');
const {When, Given, Then} = require('cucumber');
const request = require('request-promise');

const URL = 'http://localhost:8080';
const freeFields = ['A1', 'A3', 'A5', 'A7', 'A9'];

class Field {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}

var fireRequest = function(gameId, player, field) {
    return {
        method: 'DELETE',
        uri: URL + `/games/${gameId}/${player}/sea/${field.row}/${field.column}`,
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };
}

var fire = async function(attacker, fieldName, victim) {
    var field = parseField(fieldName);
    try {
        this.response = await request(fireRequest(this.gameId, victim, field))
    } catch (statusCodeError) {
        // check if really a status code error has been thrown
        this.statusCodeError = statusCodeError;
    }
}

var parseField = function(fieldName) {
    return new Field(fieldName.charAt(0), fieldName.charAt(fieldName.length - 1))
}

Given('{word} has set a {word} to {word}', async function (player, shipType, fieldName) {
    var field = parseField(fieldName);

    this.response = await request(createSetShipRequest(this.gameId, player, field.row, field.column, shipType, 'horizontally'));
});

When('{word} sets a {word} to {word}', async function (player, shipType, fieldName) {
    var field = parseField(fieldName);
    
    try {
        this.response = await request(createSetShipRequest(this.gameId, player, field.row, field.column, shipType, 'horizontally'));
    } catch (statusCodeError) {
        this.statusCodeError = statusCodeError;
    }
});

When('{word} sets a {word} to {word} {word}', async function (player, shipType, fieldName, alignment) {
    var field = parseField(fieldName);
    
    this.response = await request(createSetShipRequest(this.gameId, player, field.row, field.column, shipType, alignment));
});

Given('{word} has set {int} {word}', async function (player, count, shipType) {
    for (const fieldName of freeFields.slice(0, count)) {
        var field = parseField(fieldName);
    
        await request(createSetShipRequest(this.gameId, player, field.row, field.column, shipType, 'horizontally'));
    }
});

When('{word} sets a {word}', async function (player, shipType) {
    try {
        this.response = await request(createSetShipRequest(this.gameId, player, 'E', 10, shipType, 'horizontally'));
    } catch (statusCodeError) {
        this.statusCodeError = statusCodeError;
    }
});

Then('the ship is not set', function () {
    this.statusCodeError.statusCode.should.equal(400);
});

Then('the ship occupies the fields {word} to {word}', async function(begin, end) {
    var fields = this.response.body.fields;

    fields[0].should.equal(begin);
    fields[fields.length - 1].should.equal(end);
});

var createSetShipRequest = function(gameId, player, row, column, shipType, alignment) {
    return {
        method: 'PUT',
        uri: URL + `/games/${gameId}/${player}/sea/${row}/${column}`,
        body: {
            shipType: shipType,
            alignment: alignment
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };
}

When('{word} requests fire at {word} of {word} sea', fire)