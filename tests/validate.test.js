'use strict';

const { validateFileHash, constants } = require('../src');

describe('validateFileHash', () => {
    const correctFileSystemTextFile = './test-files/text-file.txt';
    const correctFileSystemBinaryFile = './test-files/binary-file.png';

    const correctUrlTextFile =
        'https://raw.github.com/Baristanko/hash_validator/master/test-files/text-file.txt';
    const correctUrlBinaryFile =
        'https://raw.github.com/Baristanko/hash_validator/master/test-files/binary-file.png';

    const nonexistentFileSystemFile = './test-files/nonexistent-file.txt';
    const nonexistentUrlFile =
        'https://raw.github.com/Baristanko/hash_validator/master/test-files/nonexistent-file.txt';

    const fileSystemFileWithoutHash = './test-files/file-without-hash.txt';
    const urlFileWithoutHash =
        'https://raw.github.com/Baristanko/hash_validator/master/test-files/file-without-hash.txt';

    const fileWithInvalidHash = './test-files/file-with-invalid-hash.txt';

    it('should correct validate hash for text file by file system path', async () => {
        const hash = await validateFileHash(correctFileSystemTextFile);

        expect(typeof hash).toBe('string');
    });

    it('should correct validate hash for binary file by file system path', async () => {
        const hash = await validateFileHash(correctFileSystemBinaryFile);

        expect(typeof hash).toBe('string');
    });

    it('should correct validate hash for text file by url', async () => {
        const hash = await validateFileHash(correctUrlTextFile);

        expect(typeof hash).toBe('string');
    });

    it('should correct validate hash for binary file by url', async () => {
        const hash = await validateFileHash(correctUrlBinaryFile);

        expect(typeof hash).toBe('string');
    });

    it('should return 100 error code for nonexistent file system source file', async () => {
        let error = null;

        try {
            await validateFileHash(nonexistentFileSystemFile);
        } catch (validateError) {
            error = validateError;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe(constants.ERROR_CODES.SourceFileNotFound);
    });

    it('should return 100 error code for nonexistent url source file', async () => {
        let error = null;

        try {
            await validateFileHash(nonexistentUrlFile);
        } catch (validateError) {
            error = validateError;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe(constants.ERROR_CODES.SourceFileNotFound);
    });

    it('should return 101 error code for nonexistent file system hash file', async () => {
        let error = null;

        try {
            await validateFileHash(fileSystemFileWithoutHash);
        } catch (validateError) {
            error = validateError;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe(constants.ERROR_CODES.HashFileNotFound);
    });

    it('should return 101 error code for nonexistent url hash file', async () => {
        let error = null;

        try {
            await validateFileHash(urlFileWithoutHash);
        } catch (validateError) {
            error = validateError;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe(constants.ERROR_CODES.HashFileNotFound);
    });

    it('should return 102 error code for file with invalid hash', async () => {
        let error = null;

        try {
            await validateFileHash(fileWithInvalidHash);
        } catch (validateError) {
            error = validateError;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe(constants.ERROR_CODES.HashesNotMatch);
    });
});
