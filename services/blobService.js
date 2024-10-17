const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

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


exports.generateReadSasUrl = async (containerName, fileName) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(config.azureConnectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(fileName);

  try {
    const exists = await blobClient.exists();
    
    if (!exists) {
      return { exists: false };
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(blobServiceClient.accountName, blobServiceClient.credential.accountKey);
    const expiryTime = dayjs().add(config.sasExpiryTime.replace(/\D/g, ''), config.sasExpiryTime.replace(/\d/g, '')).toDate();

    const sasOptions = {
      containerName,
      blobName: fileName,
      expiresOn: expiryTime,
      permissions: BlobSASPermissions.parse('r')
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
    return { exists: true, sasUrl: `${blobClient.url}?${sasToken}` };  // Retorna el SAS URL si el archivo existe
  } catch (error) {
    console.error('Error generating read SAS URL:', error);
    throw error;
  }
};

exports.generateWriteSasUrl = async (containerName, fileName) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(config.azureConnectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(fileName);

  try {
    const sharedKeyCredential = new StorageSharedKeyCredential(blobServiceClient.accountName, blobServiceClient.credential.accountKey);
    const expiryTime = dayjs().add(config.sasExpiryTime.replace(/\D/g, ''), config.sasExpiryTime.replace(/\d/g, '')).toDate();
    
    const sasOptions = {
      containerName,
      blobName: fileName,
      expiresOn: expiryTime,
      permissions: BlobSASPermissions.parse('w')
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
    return { exists: true, sasUrl: `${blobClient.url}?${sasToken}` };  // No se verifica la existencia para la escritura
  } catch (error) {
    console.error('Error generating write SAS URL:', error);
    throw error;
  }
};
