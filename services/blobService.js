const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

exports.downloadFile = async (containerName, fileName) => {
  try {
    console.log("Container Name:", containerName);
    console.log("File Name:", fileName);

    const blobServiceClient = BlobServiceClient.fromConnectionString(config.azureConnectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);
    const downloadBlockBlobResponse = await blobClient.download();

    const filePath = path.resolve(config.downloadDirectory, fileName);
    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }

    const writableStream = fs.createWriteStream(filePath, { flags: 'w' });  // Overwrite if file exists
    downloadBlockBlobResponse.readableStreamBody.pipe(writableStream);

    await new Promise((resolve, reject) => {
      writableStream.on('finish', resolve);
      writableStream.on('error', reject);
    });

    console.log(`File ${fileName} downloaded to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};
