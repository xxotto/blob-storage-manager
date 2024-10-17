const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

router.post('/notify/upload', fileController.handleFileUploadNotification);

module.exports = router;
