var should = require('chai').should()
const {When, Given, Then} = require('cucumber');
const request = require('request-promise');

const URL = 'http://localhost:8080';

var createGameRequest = function(player1, player2) {
    return {
        method: 'POST',
        uri: URL + '/games',
        body: {
            player1: player1,
            player2: player2
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };
}

var startGameRequest = function(gameId) {
    return {
        method: 'PUT',
        uri: URL + `/games/${gameId}/state`,
        body: {
            start: true
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    }
}

var createGame = async function(player1, player2) {
    this.response = await request(createGameRequest(player1, player2));
    this.gameId = this.response.body.id;
}

var startGame = async function() {
    try {
        this.response = await request(startGameRequest(this.gameId));
    } catch (statusCodeError) {
        this.statusCodeError = statusCodeError;
    }
}

var verifyGameCreated = function() {
    this.response.statusCode.should.equal(201);
    this.response.body.id.should.equal(0);
    this.response.headers.should.include({'location': '/games/0'});
}

var verifyErrorMessage = function(table) {
    const rows = table.hashes();

    this.statusCodeError.statusCode.should.equal(400);
    this.statusCodeError.error.type.should.equal(rows[0]['type']);
    this.statusCodeError.error.message.should.equal(rows[0]['message']);
}

var verifyErrorMessageDetails = function(docString) {
    const shipsLeftToSet = JSON.parse(docString);
    this.statusCodeError.error.details.should.deep.equal(shipsLeftToSet);
}

Given('a new battleship match between {word} and {word} has been created', createGame)
Given('a new battleship match between {word} and {word} has been requested', createGame);
When('a new battleship match between {word} and {word} is requested', createGame);

When('the start of the game is requested', startGame);

Then('a new game is created', verifyGameCreated);

Then('the requestor receives an error message', verifyErrorMessage);
Then('the details show the ships left to be placed', verifyErrorMessageDetails)

