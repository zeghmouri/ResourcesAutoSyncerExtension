const vscode = require('vscode');
const { loadConfig, saveConfig } = require('./config');
const { copyFileOrDirectoryToTemp, deleteFileOrDirectoryFromTemp, renameFileOrDirectoryInTemp } = require('./fileOperations');

let resourcesFolder;
let tempResourcesFolder;

function updatePaths(context) {
    const config = loadConfig(context);
    resourcesFolder = config.resourcesFolder;
    tempResourcesFolder = config.tempResourcesFolder;
}

function activate(context) {
    updatePaths(context);

    let disposableSave = vscode.workspace.onDidSaveTextDocument((document) => {
        const filePath = document.uri.fsPath;
        copyFileOrDirectoryToTemp(filePath, resourcesFolder, tempResourcesFolder);
    });

    let disposableCreate = vscode.workspace.onDidCreateFiles((event) => {
        for (const file of event.files) {
            const filePath = file.fsPath;
            copyFileOrDirectoryToTemp(filePath, resourcesFolder, tempResourcesFolder);
        }
    });

    let disposableDelete = vscode.workspace.onDidDeleteFiles((event) => {
        for (const file of event.files) {
            const filePath = file.fsPath;
            deleteFileOrDirectoryFromTemp(filePath, resourcesFolder, tempResourcesFolder);
        }
    });

    let disposableRename = vscode.workspace.onDidRenameFiles((event) => {
        for (const { oldUri, newUri } of event.files) {
            const oldFilePath = oldUri.fsPath;
            const newFilePath = newUri.fsPath;
            renameFileOrDirectoryInTemp(oldFilePath, newFilePath, resourcesFolder, tempResourcesFolder);
        }
    });

    let setPathsCommand = vscode.commands.registerCommand('resourcesAutoSyncer.setPaths', async () => {
        const resourcesPath = await vscode.window.showInputBox({ prompt: 'Enter the path to the resources folder' });
        const tempResourcesPath = await vscode.window.showInputBox({ prompt: 'Enter the path to the temp resources folder' });

        if (resourcesPath && tempResourcesPath) {
            saveConfig(context, resourcesPath, tempResourcesPath);
			updatePaths(context);
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

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
