// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');


let resourcesFolder;
let tempResourcesFolder;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const loadConfig = () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) return;

        const config = context.workspaceState;
        resourcesFolder = config.get('resourcesFolder', path.join(workspaceFolders[0].uri.fsPath, 'resources'));
        tempResourcesFolder = config.get('tempResourcesFolder', path.join(workspaceFolders[0].uri.fsPath, 'temp_resources'));
    };

    const saveConfig = (resources, tempResources) => {
        context.workspaceState.update('resourcesFolder', resources);
        context.workspaceState.update('tempResourcesFolder', tempResources);
        resourcesFolder = resources;
        tempResourcesFolder = tempResources;
    };

    loadConfig();

    const copyFileOrDirectoryToTemp = (filePath) => {
        if (filePath.startsWith(resourcesFolder)) {
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
    };

    const deleteFileOrDirectoryFromTemp = (filePath) => {
        if (filePath.startsWith(resourcesFolder)) {
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
    };

    const renameFileOrDirectoryInTemp = (oldFilePath, newFilePath) => {
        if (oldFilePath.startsWith(resourcesFolder)) {
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
    };

    let disposableSave = vscode.workspace.onDidSaveTextDocument((document) => {
        const filePath = document.uri.fsPath;
        copyFileOrDirectoryToTemp(filePath);
    });

    let disposableCreate = vscode.workspace.onDidCreateFiles((event) => {
        for (const file of event.files) {
            const filePath = file.fsPath;
            copyFileOrDirectoryToTemp(filePath);
        }
    });

    let disposableDelete = vscode.workspace.onDidDeleteFiles((event) => {
        for (const file of event.files) {
            const filePath = file.fsPath;
            deleteFileOrDirectoryFromTemp(filePath);
        }
    });

    let disposableRename = vscode.workspace.onDidRenameFiles((event) => {
        for (const { oldUri, newUri } of event.files) {
            const oldFilePath = oldUri.fsPath;
            const newFilePath = newUri.fsPath;
            renameFileOrDirectoryInTemp(oldFilePath, newFilePath);
        }
    });

    let setPathsCommand = vscode.commands.registerCommand('fileSyncOnSave.setPaths', async () => {
        const resourcesPath = await vscode.window.showInputBox({ prompt: 'Enter the path to the resources folder' });
        const tempResourcesPath = await vscode.window.showInputBox({ prompt: 'Enter the path to the temp resources folder' });

        if (resourcesPath && tempResourcesPath) {
            saveConfig(resourcesPath, tempResourcesPath);
            vscode.window.showInformationMessage('Paths updated successfully.');
        } else {
            vscode.window.showErrorMessage('Paths not updated. Both paths must be provided.');
        }
    });

    context.subscriptions.push(disposableSave);
    context.subscriptions.push(disposableCreate);
    context.subscriptions.push(disposableDelete);
    context.subscriptions.push(disposableRename);
    context.subscriptions.push(setPathsCommand);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
