'use strict';

const HASH_ALGORITHM = 'sha256';

const ERROR_CODES = {
    SourceFileNotFound: 100,
    HashFileNotFound: 101,
    HashesNotMatch: 102,
    UnexpectedError: 103
};

module.exports = {
    HASH_ALGORITHM,
    ERROR_CODES
};
