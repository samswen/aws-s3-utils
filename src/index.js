'use strict';

const AWS = require('aws-sdk');
const stream = require('stream');
const { createReadStream, createWriteStream } = require('fs');
const { listFolderRecursive } = require('@samwen/fs-utils');

module.exports = {
    updateAwsConfig,
    uploadFileToBucket,
    uploadFolderToBucket,
    downloadFileFromBucket
};

AWS.config.update({ region: 'us-east-1'});

function updateAwsConfig(config) {
    AWS.config.update(config);
}

let s3handle = null;

function getS3Handle() {
    if (s3handle) {
        return  s3handle;
    }
    s3handle = new AWS.S3({apiVersion: '2006-03-01'});
    return s3handle;
}

function uploadFileToBucket(path, bucket, key) {
    return new Promise((resolve) => {
        try {
            const file = createReadStream(path);
            const pass = new stream.PassThrough();
            file.pipe(pass);
            const s3 = getS3Handle();
            const params = {Bucket: bucket, Key: key, Body: pass};
            s3.upload(params, function(err) {
                if (err) {
                    console.error(err);
                    resolve(false);
                }
                return resolve(true);
            });
        } catch(err) {
            console.error(err);
            resolve(false);
        }
    });
}

async function uploadFolderToBucket(path, bucket, prefix, concurrency = 8) {
    try {
        const list = listFolderRecursive(path);
        for (let i = 0; i < list.length; i += concurrency) {
            const promises = [];
            for (let j = 0; j < concurrency && i + j < list.length; j++) {
                const full_path = path + '/' + list[i+j];
                const key = prefix + '/' + list[i+j];
                promises.push(uploadFileToBucket(full_path, bucket, key));
            }
            await Promise.all(promises);
        }
        return true
    } catch(err) {
        console.error(err);
        return false;
    }
}

function downloadFileFromBucket(path, bucket, key) {
    return new Promise((resolve) => {
        const s3 = getS3Handle();
        const params = {Bucket: bucket, Key: key};
        const s3_stream = s3.getObject(params).createReadStream();
        const file_stream = createWriteStream(path);
        s3_stream.on('error', function(err) {
            console.error(err);
            resolve(false);
        });
        s3_stream.pipe(file_stream).on('error', function(err) {
            console.error('File Stream:', err);
            resolve(false);
        }).on('close', function() {
            resolve(true);
        });
    });
}