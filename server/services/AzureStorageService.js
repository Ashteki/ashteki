const { BlobServiceClient } = require('@azure/storage-blob');
const ConfigService = require('./ConfigService');
const logger = require('../log.js');

class AzureStorageService {
    constructor() {
        this.configService = new ConfigService();
        this.connectionString =
            process.env.AZURE_STORAGE_CONNECTION_STRING ||
            this.configService.getValueForSection('storage', 'connectionString');
        this.containerName = process.env.AZURE_STORAGE_CONTAINER || 'userimages';

        if (this.connectionString) {
            this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
            const accountName = this.connectionString.match(/AccountName=([^;]+)/)?.[1];
            this.baseUrl = `https://${accountName}.blob.core.windows.net/${this.containerName}`;
        }
    }

    async uploadImage(blobName, data, contentType = 'image/png') {
        try {
            if (!this.blobServiceClient) {
                throw new Error('Azure Storage connection string not configured');
            }

            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

            // First check if container exists
            const exists = await containerClient.exists();
            if (!exists) {
                logger.info(`Container ${this.containerName} does not exist, creating...`);
                await containerClient.create();
            }

            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const buffer = Buffer.from(data, 'base64');

            const uploadResponse = await blockBlobClient.upload(buffer, buffer.length, {
                blobHTTPHeaders: { blobContentType: contentType }
            });

            return {
                success: true,
                url: blockBlobClient.url,
                etag: uploadResponse.etag
            };
        } catch (error) {
            logger.error('Error uploading to Azure Storage:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteImage(blobName) {
        try {
            if (!this.blobServiceClient) {
                throw new Error('Azure Storage connection string not configured');
            }

            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.delete();

            return { success: true };
        } catch (error) {
            logger.error('Error deleting from Azure Storage:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    getUrl(blobPath) {
        if (!this.baseUrl) {
            throw new Error('Azure Storage not configured');
        }
        return `${this.baseUrl}/${blobPath}`;
    }

    getBaseUrl() {
        return this.baseUrl;
    }
}

module.exports = AzureStorageService;