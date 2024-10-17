require('dotenv').config();

module.exports = {
  azureConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  downloadDirectory: './downloads',
  port: 7999,
  sasExpiryTime: '1m'
};