'use strict';

const fs = require('fs');
const crypto = require('crypto');

const { HASH_ALGORITHM, ERROR_CODES } = require('./constants');
const { HashValidatorError } = require('./error');
const {
    filePathIsUrl,
    getFullFilePath,
    getHashFilePath,
    createReadStreamByUrl,
    getFileByUrl,
    asyncPipeline
} = require('./utils');

async function getHashFromFileSystem(filePath) {
    try {
        const hash = await fs.promises.readFile(getHashFilePath(filePath), { encoding: 'utf-8' });
        return hash.trim();
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new HashValidatorError(
                'Hash file not found',
                ERROR_CODES.HashFileNotFound
            );
        } else {
            throw new HashValidatorError(
                `Unexpected error ${error.message}`,
                ERROR_CODES.UnexpectedError
            );
        }
    }
}

async function getHashByUrl(url) {
    try {
        const hash = await getFileByUrl(getHashFilePath(url));
        return hash.trim();
    } catch (error) {
        if (error.name === 'HTTPError') {
            throw new HashValidatorError(
                'Hash file not found',
                ERROR_CODES.HashFileNotFound
            );
        } else {
            throw new HashValidatorError(
                `Unexpected error ${error.message}`,
                ERROR_CODES.UnexpectedError
            );
        }
    }
}

async function computeHashFromSourceFile(file) {
    try {
        const hash = crypto.createHash(HASH_ALGORITHM);
        await asyncPipeline(file, hash);
        return hash.digest('hex');
    } catch (error) {
        if (error.code === 'ENOENT' || error.name === 'HTTPError') {
            throw new HashValidatorError(
                'Source file not found',
                ERROR_CODES.SourceFileNotFound
            );
        } else {
            throw new HashValidatorError(
                `Unexpected error ${error.message}`,
                ERROR_CODES.UnexpectedError
            );
        }
    }
}

function compareHashes(sourceHash, computedHash) {
    if (sourceHash !== computedHash) {
        throw new HashValidatorError('Hashes don\'t match', ERROR_CODES.HashesNotMatch);
    }
}

async function validateFromFileSystem(filePath) {
    const fullFilePath = getFullFilePath(filePath);
    const file = fs.createReadStream(fullFilePath);

    const [ sourceHash, computedHash ] = await Promise.all([
        getHashFromFileSystem(fullFilePath),
        computeHashFromSourceFile(file)
    ]);

    compareHashes(sourceHash, computedHash)

    return computedHash;
}

async function validateByUrl(url) {
    const file = await createReadStreamByUrl(url);

    const [ sourceHash, computedHash ] = await Promise.all([
        getHashByUrl(url),
        computeHashFromSourceFile(file)
    ]);

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
