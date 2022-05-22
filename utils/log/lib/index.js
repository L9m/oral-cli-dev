'use strict';

module.exports = index;

const log = require('npmlog')
log.addLevel('b', 2000, {fg: 'green'})

function index() {
    log.b('cli', 'test info1')
}
