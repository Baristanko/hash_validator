'use strict';

const path = require('path');
const util = require('util');
const stream = require('stream');

const validator = require('validator');
const got = require('got');

const { HASH_ALGORITHM } = require('./constants');

const asyncPipeline = util.promisify(stream.pipeline);

function filePathIsUrl(filePath) {
    return validator.isURL(filePath, { require_protocol: true, protocols: ['http', 'https'] });
}

function getFullFilePath(filePath) {
    return path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, filePath);
}

function getHashFilePath(filePath) {
    return `${filePath}.${HASH_ALGORITHM}`;
}

async function getFileByUrl(fileUrl) {
    return got.get(fileUrl, { resolveBodyOnly: true })
}

function createReadStreamByUrl(url) {
    return got.stream(url);
}


module.exports = {
    filePathIsUrl,
    getFullFilePath,
    getHashFilePath,
    createReadStreamByUrl,
    getFileByUrl,
    asyncPipeline
};
