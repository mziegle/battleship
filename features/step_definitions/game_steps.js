var should = require('chai').should()
const {When, Given, Then} = require('cucumber');

const createGame = async function(player1, player2) {
    this.response = await this.battleshipServer.createGame(player1, player2);
    this.gameId = this.response.body.id;
}

const startGame = async function() {
    this.response = await this.battleshipServer.startGame(this.gameId);
}

const createAndStartGame = async function(player1, player2) {
    this.response = await this.battleshipServer.createGame(player1, player2);
    this.gameId = this.response.body.id;
    this.response = await this.battleshipServer.startGame(this.gameId);
}

const verifyGameCreated = function() {
    this.response.statusCode.should.equal(201);
    this.response.body.id.should.equal(0);
    this.response.headers.should.include({'location': '/games/0'});
}

const verifyGameStarted = function() {
    this.response.statusCode.should.equal(200);
}

const verifyErrorMessage = function(table) {
    const rows = table.hashes();

    this.response.statusCode.should.equal(400);
    this.response.error.type.should.equal(rows[0]['type']);
    this.response.error.message.should.equal(rows[0]['message']);
}

const verifyErrorMessageDetails = function(docString) {
    const shipsLeftToSet = JSON.parse(docString);

    this.response.error.details.should.deep.equal(shipsLeftToSet);
}

Given('a new battleship match between {word} and {word} has been created', createGame)
Given('a new battleship match between {word} and {word} has been requested', createGame);
Given('the match has been started', startGame);
Given('{word} and {word} have started a game', createAndStartGame);

When('a new battleship match between {word} and {word} is requested', createGame);
When('the start of the game is requested', startGame);

Then('a new game is created', verifyGameCreated);
Then('the requestor receives an error message', verifyErrorMessage);
Then('the details show the ships left to be placed', verifyErrorMessageDetails)
Then('the game is started', verifyGameStarted);

