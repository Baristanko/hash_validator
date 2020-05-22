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
    asyncPipeline
} = require('./utils');

async function getHashFromFileSystem(filePath) {
    const hash = await fs.promises.readFile(getHashFilePath(filePath), { encoding: 'utf-8' });
    return hash.trim();
}

async function getHashByUrl(url) {
    const hash = await getFileByUrl(getHashFilePath(url));
    return hash.trim();
}

async function computeHashFromSourceFile(file) {
    const hash = crypto.createHash(HASH_ALGORITHM);
    await asyncPipeline(file, hash);
    return hash.digest('hex');
}

function compareHashes(sourceHash, computedHash) {
    if (sourceHash !== computedHash) {
        throw new HashValidatorError('Hashes don\'t match', ERROR_CODES.HashesNotMatch);
    }
}

async function validateFromFileSystem(filePath) {
    const file = fs.createReadStream(filePath);

    const [ sourceHash, computedHash ] = await Promise.all([
        getHashFromFileSystem(filePath),
        computeHashFromSourceFile(file)
    ]);

    console.log({ sourceHash, computedHash });

    compareHashes(sourceHash, computedHash)

    return computedHash;
}

async function validateByUrl(url) {
    const file = await createReadStreamByUrl(url);

    const [ sourceHash, computedHash ] = await Promise.all([
        getHashByUrl(url),
        computeHashFromSourceFile(file)
    ]);

    console.log({ sourceHash, computedHash });

    compareHashes(sourceHash, computedHash)

    return computedHash;
}

function validateFileHash(filePath) {
    if (filePathIsUrl(filePath)) {
        return validateByUrl(filePath);
    } else {
        return validateFromFileSystem(filePath);
    }
}

module.exports = validateFileHash;
