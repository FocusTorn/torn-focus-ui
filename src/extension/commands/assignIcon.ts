import path from 'path';
import fs from 'fs';
import { ExtensionContext, workspace, window, Uri, ConfigurationTarget } from 'vscode';
import { getIconOptionsFromDirectory } from './../helpers/getIconOptionsFromDirectory';

/**
 *
 *
 *
 * Assigns a custom icon to a file or folder in the explorer view.
 *
 * This function retrieves available file and folder icons from the extension's assets directory.
 * It then prompts the user to select an icon from a quick pick list. The selected icon is then
 * associated with the provided file or folder URI and stored in the user's global settings.
 * If no icon is selected, the function logs a message and exits.
 * In case of an error during the process, an error message is displayed to the user.
 *
 * @param context - The extension context.
 * @param fileUri - The URI of the file or folder to assign the icon to.
 */
export const assignIcon = async (context: ExtensionContext, fileUri: Uri) => {
    const folderIconsDir = path.join(context.extensionPath, 'assets', 'icons', 'folder_icons');
    const fileIconsDir = path.join(context.extensionPath, 'assets', 'icons', 'file_icons');

    try {
        let iconChosen: string | undefined = '';

        const fileIconOptions = getIconOptionsFromDirectory(fileIconsDir);
        const folderIconOptions = getIconOptionsFromDirectory(folderIconsDir, (file) => !file.endsWith('-open.svg'));

        const isFile = fs.statSync(fileUri.fsPath).isFile();
        const iconOptions = isFile ? fileIconOptions : folderIconOptions;
        const chosenExplorerItem = path.basename(fileUri.fsPath);

        const selectedIcon = await window.showQuickPick(iconOptions, {
            placeHolder: 'Select an icon',
        });

        if (selectedIcon) {
            iconChosen = selectedIcon.label;
            const config = workspace.getConfiguration('TornFocusUi.themes');
            const currentCustomIcons: { [key: string]: string } = config.get('customIcons', {}) || {};
            currentCustomIcons[chosenExplorerItem] = iconChosen;
            await config.update('customIcons', currentCustomIcons, ConfigurationTarget.Global);
        } else {
            console.log('No icon selected.');
        }
    } catch (error) {
        console.error('Error reading icons directory:', error);
        window.showErrorMessage('An error occurred while loading icons.');
    }
};

/**
 *
 *
 *
 * Reverts a custom icon assignment for a file or folder in the explorer view, restoring the default icon.
 *
 * This function retrieves the current custom icon assignments from the user's global settings.
 * It then removes the association between the provided file or folder URI and any custom icon,
 * effectively restoring the default icon. The updated icon assignments are then saved back
 * to the user's global settings.
 * If an error occurs during the process, an error message is displayed to the user.
 *
 * @param fileUri - The URI of the file or folder to revert the icon for.
 */
export const revertIcon = async (_context: ExtensionContext, fileUri: Uri) => {
    try {
        const chosenExplorerItem = path.basename(fileUri.fsPath);
        const config = workspace.getConfiguration('TornFocusUi.themes');
        const currentCustomIcons: { [key: string]: string } = config.get('customIcons', {}) || {};
        const updatedCustomIcons = { ...currentCustomIcons };
        delete updatedCustomIcons[chosenExplorerItem];

        await config.update('customIcons', updatedCustomIcons, ConfigurationTarget.Global);
    } catch (error) {
        console.error('Error reading icons directory:', error);
        window.showErrorMessage('An error occurred while loading icons.');
    }
};
