'use strict';

const axios = require('axios')
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

function getDefaultRegistry(isOriginal = false) {
    return isOriginal  ? 'https://registry.npmjs.org/' : 'https://registry.npmmirror.com/'
}

module.exports = {
    getNpmInfo
};
