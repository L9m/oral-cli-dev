'use strict';

const axios = require('axios')
const semver = require('semver')
const urljoin = require('url-join')

function getNpmInfo(npmName, registry) {
    if (!npmName) {
        return null
    }
    const registryUrl = registry || getDefaultRegistry()
    console.log(registryUrl)
    const  npmInfoUrl = urljoin(registryUrl, npmName)
    return axios.get(npmInfoUrl).then(res => {
        if (res.status === 200) {
            return res.data
        } else {
            return null
        }
    }).catch(err => {
        return Promise.reject(err)
    })
}

async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry)
    if (data) {
        return Object.keys(data.versions)
    } else {
        return []
    }
}

function getSemverVersions(baseVersion, versions) {
    return versions
    .filter(version => semver.satisfies(version, `^${baseVersion}`))
    .sort((a,b) => semver.gt(b, a))
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersions(npmName, registry)
    const newVersions = getSemverVersions(baseVersion, versions)
    if (newVersions && newVersions.length > 0 ) {
        return newVersions[0]
    }
}

function getDefaultRegistry(isOriginal = false) {
    return isOriginal  ? 'https://registry.npmjs.org/' : 'https://registry.npmmirror.com/'
}

module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersion
};
