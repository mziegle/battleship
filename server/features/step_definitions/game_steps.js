require('chai').should()

const {When, Given, Then} = require('cucumber');

const prepareNewGame = async function(player1, player2) {
    this.response = await this.battleshipServer.createGame(player1);
    this.gameId = this.response.body.id;
    this.response = await this.battleshipServer.join(this.gameId, player2);
    this.response = await this.battleshipServer.startGame(this.gameId);
}

const placeAllShipsFor = async function(player) {
    this.response = await this.battleshipServer.placeAllShipsFor(player);
}

const createGame = async function(player1) {
    this.response = await this.battleshipServer.createGame(player1);
    this.gameId = this.response.body.id;
}

const joinGame = async function(player) {
    this.response = await this.battleshipServer.join(this.gameId, player);
}

const createAndStartGame = async function(player1, player2) {
    this.response = await this.battleshipServer.registerPlayer(player1);
    this.response = await this.battleshipServer.placeAllShipsFor(player1);
    this.response = await this.battleshipServer.registerPlayer(player2);
    this.response = await this.battleshipServer.placeAllShipsFor(player2);
    this.response = await this.battleshipServer.createGame(player1);
    this.gameId = this.response.body.id;
    this.response = await this.battleshipServer.join(this.gameId, player2);
}

const verifyGameCreated = function() {
    this.response.statusCode.should.equal(201);
    this.response.body.id.should.equal(0);
    this.response.headers.should.include({'location': `/games/${this.gameId}`});
}

const verifyGameStarted = async function() {
    await this.battleshipServer.receive('GameStarted'); 
}

const verifyGameWon = async function(winner) {
    const event = await this.battleshipServer.receive('GameWon');

    event.body.winner.should.equal(winner);
}

const verifyErrorMessage = function(table) {
    const rows = table.hashes();

    this.response.statusCode.should.equal(400);
    this.response.error.type.should.equal(rows[0]['type']);
    this.response.error.message.should.equal(rows[0]['message']);
}

const verifyPlayerSwitched = async function(player) {
    const event = await this.battleshipServer.receive('ActivePlayerSwitched');

    event.body.activePlayer.should.equal(player);
}

const verifyPlayerNotSwitched = async function(player) {
    const response = await this.battleshipServer.fire(this.gameId, 'J10', 'player2');
    
    response.body.result.should.equal('water');
}

Given('a match between {word} and {word} has been started', prepareNewGame);
Given('{word} has placed all its ships', placeAllShipsFor);
Given('{word} has created a game', createGame)
Given('{word} and {word} have started a game', createAndStartGame);

When('{word} joins the game', joinGame);
When('{word} creates a new game', createGame);

Then('the player receives an error message', verifyErrorMessage);
Then('the game is started', verifyGameStarted);
Then('the game is created', verifyGameCreated);
Then('it is {word}s turn', verifyPlayerSwitched);
Then('{word} wins', verifyGameWon);
Then('{word} is allowed to fire again', verifyPlayerNotSwitched)
