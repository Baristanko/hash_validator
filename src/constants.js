'use strict';

const HASH_ALGORITHM = 'sha256';

const ERROR_CODES = {
    SourceFileNotFound: 100,
    HashFileNotFound: 101,
    HashesNotMatch: 102
}

const HTTP_CODES = {
    Redirect: 301,
    NotFound: 404,
    Success: 200,
}

module.exports = {
    HASH_ALGORITHM,
    ERROR_CODES,
    HTTP_CODES
};
