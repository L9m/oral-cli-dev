#!/usr/bin/env node
'use strict';

module.exports = core;

const semver = require('semver')
const colors = require('colors/safe')
const os = require('os')
const pathExists = require('path-exists').sync

let args

const pkg = require('../package.json')
const log = require('@oral/log')
const constant = require('./const');

function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgs()
        log.verbose('debug', 'test budeg log')
    } catch(err) {
        log.error(err.message)
    }
    
}

function checkRoot() {
    const rootCheck = require('root-check')
    rootCheck()
}

function checkNodeVersion() {
    const currentVersion = process.version
    const lowestVersion = constant.LOWEST_NODE_VERSION
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`oral-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
    }
}

function checkUserHome() {
    const userHome = os.homedir()
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在'))
    }
}

function checkInputArgs() {
    const minimist = require('minimist')   
    args = minimist(process.argv.slice(2))
    checkArgs()
}

function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}


function checkPkgVersion() {
    log.notice('cli', pkg.version)
}