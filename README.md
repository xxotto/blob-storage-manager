# blob-storage-manager

This repository contains an API that integrates with Azure Blob Storage, providing a set of utility functions for seamless interaction with the storage service. The API offers functionality such as generating secure download links, writing and uploading files, and other essential blob storage operations.

## Deployment Instructions

To deploy the API, follow these steps:

1. **Create a `.env` file**  
   In the root directory of the project, create a `.env` file and add your Azure Blob Storage connection string as follows:

   ```bash
   AZURE_STORAGE_CONNECTION_STRING=<your_azure_connection_string>
   ```

   This will allow the application to securely connect to your Azure Blob Storage account.


2. **Start the Application**  
   In the root directory of the project, create a `.env` file and add your Azure Blob Storage connection string as follows:
    
   ```bash
   node app.js
   ```

The application will launch and listen for requests on the configured port.