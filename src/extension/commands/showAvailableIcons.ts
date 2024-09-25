import * as vscode from 'vscode';
import * as path from 'path';
import { getIconOptionsFromDirectory } from './../helpers/getIconOptionsFromDirectory';

/**
 *
 *
 *
 * Displays a Markdown document listing all available file and folder icons within the extension.
 *
 * This function retrieves icon information from the extension's assets directory,
 * categorizes them into folder icons and file icons, and generates a Markdown document
 * that lists each icon with its corresponding label. The document is then displayed
 * in a new editor window, allowing users to easily browse and copy icon names.
 *
 * @param context - The extension context.
 */
export const showAvailableIcons = async (context: vscode.ExtensionContext) => {
    try {
        const folderIconsDir = path.join(context.extensionPath, 'assets', 'icons', 'folder_icons');
        const fileIconsDir = path.join(context.extensionPath, 'assets', 'icons', 'file_icons');

        const folderIconIds = getIconOptionsFromDirectory(folderIconsDir, (file) => !file.endsWith('-open.svg')).map(
            (option) => `📁 ${option.label}`
        );
        const fileIconIds = getIconOptionsFromDirectory(fileIconsDir).map((option) => `📄 ${option.label}`);

        const markdownContent = `# Available Icons\n\n## Folder Icons\n\n${folderIconIds.join(
            '\n'
        )}\n\n## File Icons\n\n${fileIconIds.join('\n')}`;

        const newDocument = await vscode.workspace.openTextDocument({
            content: markdownContent,
            language: 'markdown',
        });

        await vscode.window.showTextDocument(newDocument);
    } catch (error) {
        console.error('Error showing icons:', error);
        vscode.window.showErrorMessage('An error occurred while showing icons.');
    }
};
