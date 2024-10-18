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
   Run:
    
   ```bash
   docker-compose up --build -d
   ```

The application will launch and listen for requests on the configured port.

## Endpoints

### 1. Notify file upload and download it

**Description**: Notifies the server of an uploaded file to Azure Blob Storage and automatically downloads the file to a local folder.

- **URL**: `/api/notify/upload`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request body**:
  ```json
  {
    "containerName": "my-container",
    "fileName": "path/to/file.mp3"
  }
  ```

- **Successful response**:
  ```json
  {
    "message": "File downloaded successfully",
    "filePath": "./downloads/path/to/file.mp3",
    "success": true
  }
  ```

- **Error response**:
  ```json
   {
     "message": "Failed to download file",
     "error": "<error_message>",
     "success": false
   }
   ```

Example `curl` command:
   ```bash
   curl -X POST http://localhost:7999/api/notify/upload \
     -H "Content-Type: application/json" \
     -d '{"containerName": "my-container", "fileName": "path/to/  file.mp3"}'
   ```

### 2. Generate read-only SAS URL

**Description**: Generates a temporary SAS URL to download (read) a file from Azure Blob Storage. If the file does not exist, it returns an error.

- **URL**: `/api/sas/read`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request body**:
  ```json
  {
    "containerName": "my-container",
    "fileName": "example-file.txt"
  }
   ```

- **Successful response**:
  ```json
   {
     "sasUrl": "https://myaccount.blob.core.windows.net/ my-container/example-file.txt?sp=r&st=2024-10-17...",
     "success": true
   }
  ```

- **Error response**:
  ```json
   {
     "message": "File not found",
     "success": false
   }
   ```

Example `curl` command:
   ```bash
   curl -X POST http://localhost:7999/api/sas/read \
      -H "Content-Type: application/json" \
      -d '{"containerName": "my-container", "fileName":     "example-file.txt"}'
   ```

### 3. Generate write-only SAS URL

**Description**: Generates a temporary SAS URL to upload (write) a file to Azure Blob Storage.

- **URL**: `/api/sas/write`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request body**:
  ```json
  {
    "containerName": "my-container",
    "fileName": "new-file.txt"
  }
   ```

- **Successful response**:
  ```json
   {
     "sasUrl": "https://myaccount.blob.core.windows.net/ my-container/new-file.txt?sp=w&st=2024-10-17...",
     "success": true
   }
  ```

- **Error response**:
  ```json
   {
     "message": "Failed to generate write SAS URL",
     "error": "<error_message>",
     "success": false
   }
   ```

Example `curl` command:
   ```bash
   curl -X POST http://localhost:7999/api/sas/write \
     -H "Content-Type: application/json" \
     -d '{"containerName": "my-container", "fileName":   "new-file.txt"}'
   ```