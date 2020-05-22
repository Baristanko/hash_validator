'use strict';

const path = require('path');
const util = require('util');
const stream = require('stream');
// const url = require('url');
// const http = require('http');
// const https = require('https');

const validator = require('validator');
const got = require('got');

const { HASH_ALGORITHM, HTTP_CODES } = require('./constants');

const pipeline = util.promisify(stream.pipeline);
const finished = util.promisify(stream.finished);

function filePathIsUrl(filePath) {
    return validator.isURL(filePath, { require_protocol: true, protocols: ['http', 'https'] });
}

function getFullFilePath(filePath) {
    return path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, filePath);
}

function getHashFilePath(filePath) {
    return `${filePath}.${HASH_ALGORITHM}`;
}

// function createReadStreamByUrl(fileUrl) {
//     const { protocol } = url.parse(fileUrl);

//     const client = protocol === 'https' ? http : https;

//     return new Promise((resolve, reject) => {
//         const request = client.get(fileUrl, response => {
//             // console.log({ response });
//             console.log({ statusCode: response.statusCode });

//             const { statusCode } = response;

//             if (statusCode === HTTP_CODES.Redirect) {
//                 const location = response.headers['location'];

//                 console.log({ location });

//                 return createReadStreamByUrl(location);
//             } else {
//                 console.log('Return response');
//                 return resolve(response);
//             }
//         });

//         request.on('error', reject);
//     });
// }

async function getFileByUrl(fileUrl) {
    // console.log('getFileByUrl');
    // const fileStream = await createReadStreamByUrl(fileUrl);

    // console.log('FILE_STREAM');
    // console.log({ fileStream });

    // const chunks = [];

    // fileStream.on('data', chunk => {
    //     console.log({ chunk });
    //     chunks.push(chunk);
    // });

    // await finished(fileStream);

    // console.log('Finished');

    // console.log({ chunks });

    // return Buffer.from(chunks).toString();
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
    pipeline
};
