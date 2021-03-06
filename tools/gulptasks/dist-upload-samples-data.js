/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const { uploadFiles, isDirectoryOrSystemFile, toS3Path } = require('./lib/uploadS3');


const SOURCE_DIR = 'samples/data';
const S3_DEST_PATH = 'demos';
const BUCKET = 'assets.highcharts.com';


/**
 * Upload samples data to S3.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function distUploadSamplesData() {
    const argv = require('yargs').argv;
    const bucket = argv.bucket || BUCKET;
    let sourceDir = argv.sourceDir || SOURCE_DIR;

    if (!sourceDir.endsWith('/')) {
        sourceDir = sourceDir + '/';
    }

    const sourceFiles = glob.sync(`${sourceDir}/**/*`).filter(file => !isDirectoryOrSystemFile(file));
    const rootFiles = sourceFiles.map(file => toS3Path(file, sourceDir + '/', S3_DEST_PATH));

    return uploadFiles({
        files: [...rootFiles],
        name: 'highcharts-samples-data',
        bucket,
        profile: argv.profile
    });
}

distUploadSamplesData.description = 'Uploads samples data to S3';
distUploadSamplesData.flags = {
    '--profile': 'AWS profile to load from AWS credentials file. If no profile is provided the default profile or ' +
        'standard AWS environment variables for credentials will be used. (optional)'
};

gulp.task('dist-upload-samples-data', distUploadSamplesData);
