const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

// Normalize paths to lower case on Windows only
function normalizePath(filePath) {
    return process.platform === 'win32' ? filePath.toLowerCase() : filePath;
}

function copyFileOrDirectoryToTemp(filePath, resourcesFolder, tempResourcesFolder) {
    const normalizedFilePath = normalizePath(filePath);
    const normalizedResourcesFolder = normalizePath(resourcesFolder);

    if (normalizedFilePath.startsWith(normalizedResourcesFolder)) {
        const relativePath = path.relative(resourcesFolder, filePath);
        const tempFilePath = path.join(tempResourcesFolder, relativePath);

        fs.stat(filePath, (err, stats) => {
            if (err) {
                vscode.window.showErrorMessage(`Failed to stat file: ${err.message}`);
                return;
            }

            if (stats.isDirectory()) {
                fs.mkdir(tempFilePath, { recursive: true }, (err) => {
                    if (err) {
                        vscode.window.showErrorMessage(`Failed to create directory: ${err.message}`);
                    } else {
                        vscode.window.showInformationMessage(`Directory created in temp_resources: ${relativePath}`);
                    }
                });
            } else {
                fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
                fs.copyFile(filePath, tempFilePath, (err) => {
                    if (err) {
                        vscode.window.showErrorMessage(`Failed to copy file: ${err.message}`);
                    } else {
                        vscode.window.showInformationMessage(`File copied to temp_resources: ${relativePath}`);
                    }
                });
            }
        });
    }
}

function deleteFileOrDirectoryFromTemp(filePath, resourcesFolder, tempResourcesFolder) {
    const normalizedFilePath = normalizePath(filePath);
    const normalizedResourcesFolder = normalizePath(resourcesFolder);

    if (normalizedFilePath.startsWith(normalizedResourcesFolder)) {
        const relativePath = path.relative(resourcesFolder, filePath);
        const tempFilePath = path.join(tempResourcesFolder, relativePath);

        fs.stat(tempFilePath, (err, stats) => {
            if (err) {
                if (err.code !== 'ENOENT') {
                    vscode.window.showErrorMessage(`Failed to stat temp file: ${err.message}`);
                }
                return;
            }

            if (stats.isDirectory()) {
                fs.rmdir(tempFilePath, { recursive: true }, (err) => {
                    if (err) {
                        vscode.window.showErrorMessage(`Failed to delete directory: ${err.message}`);
                    } else {
                        vscode.window.showInformationMessage(`Directory deleted from temp_resources: ${relativePath}`);
                    }
                });
            } else {
                fs.unlink(tempFilePath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        vscode.window.showErrorMessage(`Failed to delete file: ${err.message}`);
                    } else {
                        vscode.window.showInformationMessage(`File deleted from temp_resources: ${relativePath}`);
                    }
                });
            }
        });
    }
}

function renameFileOrDirectoryInTemp(oldFilePath, newFilePath, resourcesFolder, tempResourcesFolder) {
    const normalizedOldFilePath = normalizePath(oldFilePath);
    const normalizedResourcesFolder = normalizePath(resourcesFolder);

    if (normalizedOldFilePath.startsWith(normalizedResourcesFolder)) {
        const relativeOldPath = path.relative(resourcesFolder, oldFilePath);
        const tempOldFilePath = path.join(tempResourcesFolder, relativeOldPath);
        const relativeNewPath = path.relative(resourcesFolder, newFilePath);
        const tempNewFilePath = path.join(tempResourcesFolder, relativeNewPath);

        fs.rename(tempOldFilePath, tempNewFilePath, (err) => {
            if (err) {
                vscode.window.showErrorMessage(`Failed to rename file or directory: ${err.message}`);
            } else {
                vscode.window.showInformationMessage(`File or directory renamed in temp_resources: ${relativeNewPath}`);
            }
        });
    }
}

module.exports = {
    copyFileOrDirectoryToTemp,
    deleteFileOrDirectoryFromTemp,
    renameFileOrDirectoryInTemp
};
