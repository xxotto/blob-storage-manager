const blobService = require('../services/blobService');
const { logger } = require('../utils/logger');
const config = require('../config/config');
const path = require('path');

exports.handleFileUploadNotification = async (req, res) => {
  const { containerName, fileName } = req.body;

  try {
    processFile(containerName, fileName)
      .then(() => logger.info(`Archivo ${fileName} procesado exitosamente.`))
      .catch((err) => logger.error(`Error al procesar el archivo ${fileName}: ${err.message}`));

    res.status(200).json({
      message: `Inicia descarga para el archivo ${fileName}`,
      success: true
    });
  } catch (error) {
    logger.error(`Error al iniciar el procesamiento del archivo ${fileName}: ${error.message}`);
    res.status(500).json({
      message: `Error al iniciar el procesamiento del archivo: ${fileName}`,
      error: error.message,
      success: false
    });
  }
};

async function processFile(containerName, fileName) {
  try {
    const filePath = await blobService.downloadFile(containerName, fileName);

    const originalDir = path.dirname(filePath);
    const originalFileName = path.basename(filePath);

    const transformedFileName = `${config.prefix}_${originalFileName}`;
    const transformedFilePath = path.join(originalDir, transformedFileName);

    await blobService.convertToPcm(filePath, transformedFilePath);

    const uploadPath = path.relative(config.downloadDirectory, transformedFilePath);
    
    await blobService.uploadFile(containerName, uploadPath, transformedFilePath);
  } catch (error) {
    logger.error(`Error durante el procesamiento del archivo: ${error.message}`);
  }
}

exports.generateReadSasUrl = async (req, res) => {
  const { containerName, fileName } = req.body;

  if (!containerName || !fileName) {
    logger.warn('Missing container name or file name in request body.');
    return res.status(400).json({ message: 'Container name and file name are required' });
  }

  try {
    const result = await blobService.generateReadSasUrl(containerName, fileName);

    if (!result.exists) {
      logger.info(`File not found: ${fileName}`);
      return res.status(404).json({ message: 'File not found', success: false });
    }

    logger.info(`Generated read SAS URL for file: ${fileName}`);
    res.status(200).json({ sasUrl: result.sasUrl, success: true });
  } catch (error) {
    logger.error(`Failed to generate read SAS URL: ${error.message}`);
    res.status(500).json({ message: 'Failed to generate read SAS URL', error: error.message, success: false });
  }
};

exports.generateWriteSasUrl = async (req, res) => {
  const { containerName, fileName } = req.body;

  if (!containerName || !fileName) {
    logger.warn('Missing container name or file name in request body.');
    return res.status(400).json({ message: 'Container name and file name are required' });
  }

  try {
    const result = await blobService.generateWriteSasUrl(containerName, fileName);
    logger.info(`Generated write SAS URL for file: ${fileName}`);

    res.status(200).json({ sasUrl: result.sasUrl, success: true });
  } catch (error) {
    logger.error(`Failed to generate write SAS URL: ${error.message}`);
    res.status(500).json({ message: 'Failed to generate write SAS URL', error: error.message, success: false });
  }
};
