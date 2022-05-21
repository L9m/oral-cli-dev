#!/usr/bin/env node
'use strict';

module.exports = core;

const pkg = require('../package.json')

function core() {
    // TODO
    console.log('exec core1')
    checkPkgVersion()
}


function checkPkgVersion() {
    console.log(pkg.version)
}