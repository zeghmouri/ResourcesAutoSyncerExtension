const vscode = require('vscode');
const path = require('path');

function normalizePath(filePath) {
    return process.platform === 'win32' ? filePath.toLowerCase() : filePath;
}

function loadConfig(context) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return {};

    const config = context.workspaceState;
    return {
        resourcesFolder: config.get('resourcesFolder', path.join(workspaceFolders[0].uri.fsPath, 'resources')),
        tempResourcesFolder: config.get('tempResourcesFolder', path.join(workspaceFolders[0].uri.fsPath, 'temp_resources'))
    };
}

function saveConfig(context, resourcesFolder, tempResourcesFolder) {
    context.workspaceState.update('resourcesFolder', resourcesFolder);
    context.workspaceState.update('tempResourcesFolder', tempResourcesFolder);
}

module.exports = {
    normalizePath,
    loadConfig,
    saveConfig
};
