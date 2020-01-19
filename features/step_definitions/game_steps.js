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

var createGame = async function(player1, player2) {
    this.response = await request(createGameRequest(player1, player2));
    this.gameId = this.response.body.id;
}

var verifyGameCreated = function() {
    this.response.statusCode.should.equal(201);
    this.response.body.id.should.equal(0);
    this.response.headers.should.include({'location': '/games/0'});
}

Given('a new battleship match between {word} and {word} has been requested', createGame);
When('a new battleship match between {word} and {word} is requested', createGame);

Then('a new game is created', verifyGameCreated);

