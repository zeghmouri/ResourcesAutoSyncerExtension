# ResourcesAutoSyncer

ResourcesAutoSyncer is a VS Code extension that automatically synchronizes files and directories between the `resources` and `temp_resources` folders. 

## Features

- Automatically copy modified files from `resources` to `temp_resources` on save.
- Automatically copy new files and directories from `resources` to `temp_resources`.
- Automatically delete files and directories from `temp_resources` when they are deleted from `resources`.
- Automatically rename files and directories in `temp_resources` when they are renamed in `resources`.

## Usage

1. Install the extension.
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
3. Run the command `ResourcesAutoSyncer: Set Paths`.
4. Enter the paths for the `resources` and `temp_resources` folders.
5. The extension will now automatically synchronize changes from `resources` to `temp_resources`.

## Configuration

You can set the paths for the `resources` and `temp_resources` folders using the `ResourcesAutoSyncer: Set Paths` command.

## Contributing

If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

MIT
