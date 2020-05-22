'use strict';

class HashValidatorError extends Error {
    constructor(message, code) {
        super(message);

        this.code = code;
        this.name = 'HashValidatorError';
    }
}

module.exports = {
    HashValidatorError
};
