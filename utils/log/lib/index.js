'use strict';

module.exports = index;

const log = require('npmlog')
log.addLevel('a', 2000, {fg: 'green'})

function index() {
    log.a('cli', 'test info1')
}
