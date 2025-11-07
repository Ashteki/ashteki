const fs = require('fs');
const path = require('path');
const AzureStorageService = require('../services/AzureStorageService');
const UserService = require('../services/AshesUserService');
const ConfigService = require('../services/ConfigService');

const configService = new ConfigService();
const userService = new UserService(configService);
const storageService = new AzureStorageService();

async function migrateImages() {
    try {
        console.log('Starting image migration to Azure Storage...');

        // Migrate avatars
        console.log('Migrating avatars...');
        const avatarPath = path.join(__dirname, '../../public/img/avatar');
        if (fs.existsSync(avatarPath)) {
            const avatarFiles = fs.readdirSync(avatarPath);
            for (const file of avatarFiles) {
                if (file.endsWith('.png')) {
                    const filePath = path.join(avatarPath, file);
                    const fileData = fs.readFileSync(filePath, { encoding: 'base64' });

                    console.log(`Uploading avatar: ${file}`);
                    const result = await storageService.uploadImage(`avatars/${file}`, fileData);

                    if (result.success) {
                        console.log(`Successfully uploaded avatar: ${file}`);
                        // Keep the local file for now as backup
                        // fs.unlinkSync(filePath);
                    } else {
                        console.error(`Failed to upload avatar ${file}:`, result.error);
                    }
                }
            }
        }

        // Migrate backgrounds
        console.log('\\nMigrating backgrounds...');
        const bgPath = path.join(__dirname, '../../public/img/bgs');
        if (fs.existsSync(bgPath)) {
            const bgFiles = fs.readdirSync(bgPath);
            for (const file of bgFiles) {
                if (file.endsWith('.png')) {
                    const filePath = path.join(bgPath, file);
                    const fileData = fs.readFileSync(filePath, { encoding: 'base64' });

                    console.log(`Uploading background: ${file}`);
                    const result = await storageService.uploadImage(`bgs/${file}`, fileData);

                    if (result.success) {
                        console.log(`Successfully uploaded background: ${file}`);
                        // Keep the local file for now as backup
                        // fs.unlinkSync(filePath);
                    } else {
                        console.error(`Failed to upload background ${file}:`, result.error);
                    }
                }
            }
        }

        console.log('\\nMigration complete!');
        console.log('Note: Local files have been kept as backup. After verifying the migration,');
        console.log('you can delete the files in public/img/avatar and public/img/bgs');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateImages().catch(console.error);