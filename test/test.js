/* eslint-disable no-undef */
'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const { execSync } = require('child_process');
const {
    updateAwsConfig,
    uploadFileToBucket,
    uploadFolderToBucket
} = require('../src');

const my_bucket = 'my_bucket';

const aws_credentials = {
    accessKeyId: 'MyAccessKeyId', 
    secretAccessKey: 'MySecretAccessKey',
    region: "us-east-1" 
};

describe('test uploadFileToBucket', () => {

    it('verifies it should upload the folder', async () => {

        const stdout1 = execSync('rm -rf /tmp/aws-s3-test; unzip test/test_folder.zip -d /tmp/aws-s3-test');

        assert.isNotNull(stdout1);
        const str1 = stdout1.toString();

        const count1 = (str1.match(/\n/g) || []).length;
        expect(count1).greaterThan(6);

        updateAwsConfig(aws_credentials);

        await uploadFileToBucket('/tmp/aws-s3-test/test_folder/a', my_bucket, 'test_folder/a');

    });
});

describe('test uploadFolderToBucket', () => {

    it('verifies it should upload the folder', async () => {

        const stdout1 = execSync('rm -rf /tmp/aws-s3-test; unzip test/test_folder.zip -d /tmp/aws-s3-test');

        assert.isNotNull(stdout1);
        const str1 = stdout1.toString();

        const count1 = (str1.match(/\n/g) || []).length;
        expect(count1).greaterThan(6);
        
        updateAwsConfig(aws_credentials);

        await uploadFolderToBucket('/tmp/aws-s3-test/test_folder/', my_buckt, 'test_folder');

    });
});
