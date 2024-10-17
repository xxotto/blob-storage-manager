const blobService = require('../services/blobService');

exports.handleFileUploadNotification = async (req, res) => {
  const { containerName, fileName } = req.body;

  if (!containerName || !fileName) {
    return res.status(400).json({ message: 'Container name and file name are required' });
  }

  try {
    const filePath = await blobService.downloadFile(containerName, fileName);
    
    res.status(200).json({ 
      message: 'File downloaded successfully', 
      filePath: filePath, 
      success: true 
    });
  } catch (error) {

    res.status(500).json({ 
      message: 'Failed to download file', 
      error: error.message, 
      success: false 
    });
  }
};
