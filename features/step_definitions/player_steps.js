require('chai').should()

const {Given, Then, When} = require('cucumber');

const registerPlayer = async function(name) {
    this.response = await this.battleshipServer.registerPlayer(name);
}

const verifyPlayerAdded = function() {
    this.response.statusCode.should.equal(201);
}

Given('{word} has been registered', registerPlayer);
Given('the name {word} is already used', registerPlayer);
When('a new player registers with the name {word}', registerPlayer);
Then('the player is added', verifyPlayerAdded);
