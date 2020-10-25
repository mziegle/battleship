const { After, Before, setWorldConstructor } = require('cucumber')
const Sut = require('../support/sut')
const BattleshipServer = require('./service').BattleshipServer

class World {

    constructor() {
        this.sut = new Sut('node', ['src/battleship/index.js']);
    }

    requireSut() {
        return this.sut.start();
    }

    shutdownSut() {
        return this.sut.stop();
    }
}

setWorldConstructor(World)

Before(async function (testCase) {
    await this.requireSut();
    this.battleshipServer = new BattleshipServer();
});
  
After(async function (testCase) {
    await this.shutdownSut();
    this.battleshipServer.shutdown();
});