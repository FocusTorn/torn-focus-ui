import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 *
 *
 *
 * Displays a Markdown document showcasing the folder icon assignments from the theme's configuration.
 *
 * This function reads the icon mapping from either the base theme or the user's customized theme,
 * based on the user's selection. It then generates a Markdown document that presents a list of
 * available folder icons and the folder names associated with each icon ID.
 * The document is displayed in a new editor window for easy reference.
 *
 * @param context - The extension context.
 */
export const showFolderIconAssignment = async (context: vscode.ExtensionContext) => {
    try {
        const baseThemePath = path.join(context.extensionPath, 'themes', 'torn_focus_icons.json');
        const mainThemePath = path.join(context.extensionPath, 'themes', 'torn_focus_icons.json');

        const chosenManifest = await vscode.window.showQuickPick(
            [
                { label: 'Base Theme', manifest: baseThemePath },
                { label: 'Customized Theme', manifest: mainThemePath },
            ],
            { placeHolder: 'Where do you want to apply the icon theme?' }
        );
        if (!chosenManifest) {
            return;
        }

        const manifest = JSON.parse(fs.readFileSync(chosenManifest.manifest, 'utf-8'));

        // Create a map to group folder names by icon ID
        const iconAssignments: { [iconId: string]: string[] } = {};

        for (const folderName in manifest.folderNames) {
            const iconId = manifest.folderNames[folderName];
            if (!iconAssignments[iconId]) {
                iconAssignments[iconId] = [];
            }
            iconAssignments[iconId].push(folderName);
        }

        // Construct the markdown content
        let markdownContent = '# Available Folder Icons\n\n';

        for (const iconId in iconAssignments) {
            const folders = iconAssignments[iconId];

            // Multiple folders: list format with line break
            markdownContent += `(iconID: \`${iconId.replace('_folder-', '')}\`)\n`;
            folders.forEach((folderName) => {
                markdownContent += `- ${folderName}\n`;
            });
            markdownContent += '\n';
        }

        const newDocument = await vscode.workspace.openTextDocument({
            content: markdownContent,
            language: 'markdown',
        });

        await vscode.window.showTextDocument(newDocument);
    } catch (error) {
        console.error('Error showing folder icons:', error);
        vscode.window.showErrorMessage('An error occurred while showing folder icons.');
    }
};
