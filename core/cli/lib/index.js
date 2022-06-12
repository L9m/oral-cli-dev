#!/usr/bin/env node
'use strict';

module.exports = core;

const semver = require('semver')
const colors = require('colors/safe')
const os = require('os')
const pathExists = require('path-exists').sync
const path = require('path');
const log = require('@oral/log')

const pkg = require('../package.json')
const constant = require('./const');

let args, config, userHome;


async function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgs()
        checkEnv()
        await checkGlobalUpdate()
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
    userHome = os.homedir()
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

async function checkGlobalUpdate() {
    // 1.获取当前版本号和模块名

    const currentVersion =pkg.version
    const npmName = pkg.name
    // 2.调用 npm API ,获取所有版本号
    const {getNpmSemverVersion} = require('@oral/get-npm-info')
    const lastVersion = await getNpmSemverVersion(currentVersion, npmName)
    if (lastVersion && semver.gte(lastVersion, currentVersion)) {
        log.warn(colors.yellow(`更新提示`,`请手动更新 ${npmName}，当前版本：${currentVersion},最新版本${lastVersion}
        更新命令：npm install -g ${npmName}`))
    }
}

function checkEnv() {
    const dotenv = require('dotenv')
    const dotenvPath =  path.resolve(userHome,'.env')
    if (pathExists(dotenvPath)) {
        config = dotenv.config({
            path: dotenvPath
        })
    }
    createDefaultConfig()
    log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome,
    }

    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome, process.env.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}


function checkPkgVersion() {
    log.notice('cli', pkg.version)
}