'use strict';

const fs = require('fs');
const crypto = require('crypto');

const { HASH_ALGORITHM, ERROR_CODES } = require('./constants');
const { HashValidatorError } = require('./error');
const {
    filePathIsUrl,
    getHashFilePath,
    createReadStreamByUrl,
    getFileByUrl,
    pipeline
} = require('./utils');

async function getHashFromFileSystem(filePath) {
    const hash = await fs.promises.readFile(getHashFilePath(filePath), { encoding: 'utf-8' });
    return hash.trim();
}

async function getHashByUrl(url) {
    const hash = await getFileByUrl(url);

    console.log({ hash });

    return hash.trim();
}

async function computeHashFromSourceFile(file) {
    const hash = crypto.createHash(HASH_ALGORITHM);

    await pipeline(file, hash);

    return hash.digest('hex');
}

async function validateFromFileSystem(filePath) {
    const file = fs.createReadStream(filePath);

    const [ sourceHash, computedHash ] = await Promise.all([
        getHashFromFileSystem(filePath),
        computeHashFromSourceFile(file)
    ]);

    if (sourceHash !== computedHash) {
        throw new HashValidatorError('Hashes don\'t match', ERROR_CODES.HashesNotMatch);
    }

    return computedHash;
}

async function validateByUrl(url) {
    const file = await createReadStreamByUrl(url);

    console.log('validateByUrl');

    const [ sourceHash, computedHash ] = await Promise.all([
        getHashByUrl(url),
        computeHashFromSourceFile(file)
    ]);

    console.log({ sourceHash, computedHash });
}

function validateFileHash(filePath) {
    if (filePathIsUrl(filePath)) {
        console.log('File path is url');
        return validateByUrl(filePath);
    } else {
        return validateFromFileSystem(filePath);
    }
}

module.exports = validateFileHash;
