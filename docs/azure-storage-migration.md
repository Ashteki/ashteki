# Azure Storage Migration Guide

This document describes how to migrate user avatars and custom backgrounds from local storage to Azure Blob Storage.

## Prerequisites

1. Make sure you have configured Azure Storage in your environment:
   ```
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string
   AZURE_STORAGE_CONTAINER=userimages  # or your preferred container name
   ```

2. Ensure your Azure Storage account is set up and you have the correct access rights.

## Running the Migration

1. First, ensure your application is not running to prevent any new image uploads during migration.

2. Run the migration script:
   ```bash
   node server/scripts/migrateToAzureStorage.js
   ```

3. The script will:
   - Upload all avatars from `public/img/avatar` to Azure Storage
   - Upload all backgrounds from `public/img/bgs` to Azure Storage
   - Keep local files as backup initially

4. Monitor the console output for any errors during migration.

## Post-Migration

1. Test the application with Azure Storage:
   - Log in and verify that existing avatars display correctly
   - Check that custom backgrounds load properly
   - Try uploading a new avatar and background

2. Once everything is verified:
   - You can safely delete the local files in:
     - `public/img/avatar`
     - `public/img/bgs`

## Rollback Plan

If you need to rollback:
1. The local files are kept as backup during initial migration
2. Set `AZURE_STORAGE_CONNECTION_STRING` to an empty string to fall back to local storage
3. Restart the application

## Troubleshooting

If you encounter any issues:
1. Check Azure Storage connection string
2. Verify container permissions
3. Check the application logs for detailed error messages
4. Ensure all file paths are correct for your environment