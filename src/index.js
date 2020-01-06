'use strict';

const AWS = require('aws-sdk');
const stream = require('stream');
const { createReadStream } = require('fs');
const { listFolderRecursive } = require('@samwen/fs-utils');

module.exports = {
    updateAwsConfig,
    uploadFileToBucket,
    uploadFolderToBucket
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

    const file = createReadStream(path);
    const pass = new stream.PassThrough();
    file.pipe(pass);

    return new Promise((resolve, reject) => {

        const s3 = getS3Handle();
        const params = {Bucket: bucket, Key: key, Body: pass};
        s3.upload(params, function(err) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            return resolve();
        });
    });
}

async function uploadFolderToBucket(path, bucket, prefix, concurrency = 8) {

    const list = listFolderRecursive(path);
    console.log(list);
    for (let i = 0; i < list.length; i += concurrency) {
        const promises = [];
        for (let j = 0; j < concurrency && i + j < list.length; j++) {
            const full_path = path + '/' + list[i+j];
            const key = prefix + '/' + list[i+j];
            promises.push(uploadFileToBucket(full_path, bucket, key));
        }
        await Promise.all(promises);
    }
}