const assert = require('assert');
const {When, Then } = require('cucumber');
const request = require('request-promise');

const TRACKER_SIMULATOR = 'http://localhost:3000';

When('a request is sent with', async function(dataTable) {
    var options = {
        method: dataTable.hashes()[0].method,
        uri: TRACKER_SIMULATOR + dataTable.hashes()[0].path,
        resolveWithFullResponse: true
    };

    this.response = await request(options);
});

Then('it is answered with', async function (dataTable) {
    assert.equal(dataTable.hashes()[0]['status code'], this.response.statusCode);
    assert.equal(dataTable.hashes()[0]['status message'], this.response.statusMessage);
});