const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

router.post('/notify/upload', fileController.handleFileUploadNotification);
router.post('/sas/read', fileController.generateReadSasUrl);
router.post('/sas/write', fileController.generateWriteSasUrl);

module.exports = router;
