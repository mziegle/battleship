const { spawn } = require('child_process');

class Sut {

    constructor(command, args) {
        this.command = command;
        this.args = args ? args : [];
    }

    start() {
        return new Promise((resolve, reject) => {
            this.sutProcess = spawn(this.command, this.args);

            this.sutProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
                resolve();
            });

            this.sutProcess.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
                reject('Sut wrote to stderr');
            });

            this.sutProcess.on('close', (code) => {
                if (!this.sutProcess.killed) {
                    console.log(`Sut was terminated unexpectedly with code ${code}`);
                    reject('Sut has been closed');
                }
            });
        })
    }

    stop() {
        if (this.sutProcess) {
            return new Promise((resolve, reject) => {
                this.sutProcess.on('close', (_, signal) => {
                    console.log(`Sut successfully closed by ${signal}`);
                    if (this.sutProcess.killed) {
                        resolve();
                    } else {
                        reject();
                    }
                });

                this.sutProcess.kill();
            });
        }
        throw new Error('Sut is not started');
    }
}

module.exports = Sut;