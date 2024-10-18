const express = require('express');
const fileRoutes = require('./routes/fileRoutes');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');

const app = express();

const downloadDir = path.resolve(__dirname, 'downloads');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
  console.log(`Created "downloads" directory at ${downloadDir}`);
}

app.use(express.json());
app.use('/api', fileRoutes);
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

const port = config.port;
app.listen(port, () => {
  console.log(`File Handler Service running on port ${port}`);
});
