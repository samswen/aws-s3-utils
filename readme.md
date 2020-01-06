# aws-s3-utils

an useful collection of utils for aws s3 operations.

## how to install

    npm install @samwen/aws-s3-utils --save

## how to use

    const { updateAwsConfig, uploadFileToBucket, uploadFolderToBucket } = require('@samwen/aws-s3-utils');
    
    const my_bucket = 'my_bucket';
    
    const aws_credentials = {
        accessKeyId: 'MyAccessKeyId', 
        secretAccessKey: 'MySecretAccessKey',
        region: "us-east-1" 
    };
    
    updateAwsConfig(aws_credentials);
    
    await uploadFileToBucket('/tmp/aws-s3-test/test_folder/a', my_bucket, 'test_folder/a');
    
    await uploadFolderToBucket('/tmp/aws-s3-test/test_folder/', my_buckt, 'test_folder2');
