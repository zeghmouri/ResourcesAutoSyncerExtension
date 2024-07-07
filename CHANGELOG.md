# Change Log

All notable changes to the "resources-auto-syncer" extension will be documented in this file.


## [1.0.0] - 2024-07-07
### Added
- Initial release of Resources Auto Syncer extension.
- Automatically syncs files and directories from a resources folder to a temporary resources folder.
- Supports syncing on file save, create, delete, and rename operations.
- Command to set paths for resources and temporary resources folders directly from VS Code.

### Features
- **Auto Sync on Save:** Files are automatically copied to the temporary resources folder upon saving changes in the resources folder.
- **Create and Delete Sync:** New files and deleted files are synchronized between the resources folder and the temporary resources folder.
- **Rename Sync:** Renaming files is reflected in both the resources folder and the temporary resources folder.
- **Customizable Paths:** Users can set and update paths to the resources folder and temporary resources folder through a dedicated VS Code command (`resourcesAutoSyncer.setPaths`).

### Notes
- This release provides basic functionality for syncing files between specified folders.
- Users can configure paths and customize synchronization behavior.
- Future updates may include:
  - Bug fixes based on initial user feedback after usage.
  - Enhanced configuration options for more precise synchronization.