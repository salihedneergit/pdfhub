const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadFile = async (file, name) => {
    if (!file || !file.buffer || !file.originalname) {
        throw new Error('Invalid file input');
    }

    // Use user-defined name if provided, else fall back to the original file name
    const fileName = name || file.originalname;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName, // Use the user-defined name or fallback to original name
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private', // Change to 'public-read' if public access is required
    };

    try {
        const data = await s3.upload(params).promise();
        console.log(`File uploaded successfully: ${data.Location}`);
        return data;
    } catch (err) {
        throw new Error(`Failed to upload file: ${err.message}`);
    }
};


const deleteFile = async (key) => {
    if (!key) {
        throw new Error('File key is required for deletion');
    }

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    };

    try {
        await s3.deleteObject(params).promise();
        console.log(`File deleted successfully: ${key}`);
    } catch (err) {
        throw new Error(`Failed to delete file: ${err.message}`);
    }
};

const generateSignedUrl = (key) => {
    if (!key) {
        throw new Error('File key is required to generate a signed URL');
    }

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Expires: 600, // URL expires in 60 seconds
    };

    try {
        const url = s3.getSignedUrl('getObject', params);
        console.log(`Signed URL generated: ${url}`);
        return url;
    } catch (err) {
        throw new Error(`Failed to generate signed URL: ${err.message}`);
    }
};

const listFiles = async () => {
    const params = { Bucket: process.env.AWS_S3_BUCKET };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const fileKeys = data.Contents.map((item) => item.Key);
        console.log(`Files listed successfully: ${fileKeys}`);
        return fileKeys;
    } catch (err) {
        throw new Error(`Failed to list files: ${err.message}`);
    }
};



module.exports = { uploadFile, deleteFile, generateSignedUrl, listFiles };
