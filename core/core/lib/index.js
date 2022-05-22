#!/usr/bin/env node
'use strict';

module.exports = core;

const pkg = require('../package.json')
const log = require('@oral/log')

function core() {
    checkPkgVersion()
}


function checkPkgVersion() {
    console.log(pkg.version)
    log()
}