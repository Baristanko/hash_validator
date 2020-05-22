'use strict';

const { validateFileHash, constants } = require('./src');

function run() {
    const filePath = process.argv[2];

    validateFileHash(filePath)
        .then((hash) => {
            console.log(`File hash validate successfully: ${hash}`);
            process.exitCode = 0;
        })
        .catch((error) => {
            console.error(`File hash validate error: ${error.message}`);
            process.exitCode = error.code;
        });
}

if (!module.parent) {
    process.on('uncaughtException', (error) => {
        console.error('Uncaught exception:', error);
        process.exitCode = constants.ERROR_CODES.UnexpectedError;
    });

    process.on('unhandledRejection', (reason) => {
        console.error('Unhandled rejection:', reason);
        process.exitCode = constants.ERROR_CODES.UnexpectedError;
    });

    run();
}
