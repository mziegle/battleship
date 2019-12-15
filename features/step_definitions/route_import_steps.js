const assert = require('assert');
const { After, Before, Given, When, Then } = require('cucumber');
const request = require('request-promise');
const fs = require('fs')

const TRACKER_SIMULATOR_URL = 'http://localhost:3000';

Before(async function (testCase) {
    await this.requireSut();
});

After(async function (testCase) {
    await this.shutdownSut();
});

When('a route is sent to {string}', async function(path) {
    var data = await getData('features/Landsberger_Str_334-Fürstenrieder_Str_30.kml', 'utf8');
    var options = {
        method: 'PUT',
        uri: TRACKER_SIMULATOR_URL + path,
        body: data,
        headers: {
            'content-type': 'text/xml'
        },
        resolveWithFullResponse: true
    };

    this.response = await request(options);
});

Then('the route is created', async function() {
    assert.equal('201', this.response.statusCode);
});

function getData(fileName, type) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, type, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}