'use strict';

const { validateFileHash } = require('./src');

process.on('uncaughtException', (error) => console.error({ error }));
process.on('unhandledRejection', (error, promise) => console.error({ error, promise }));

function run() {
    const filePath = process.argv[2];

    validateFileHash(filePath)
        .then(hash => {
            console.log(`File hash validate successfully: ${hash}`);
            process.exitCode = 0;
        })
        .catch(error => {
            console.error(`File hash validate error: ${error.message}`);
            process.exitCode = error.code;
        });
}

if (!module.parent) {
    run();
}
