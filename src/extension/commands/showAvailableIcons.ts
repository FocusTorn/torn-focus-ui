import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

//--- getIconIdsFromDirectory ----------------------------------------------------------------------->>

function getIconIdsFromDirectory(directoryPath: string): string[] {
    const iconFiles = fs.readdirSync(directoryPath);
    return iconFiles
        .filter((file) => {
            return (
                path.extname(file).toLowerCase() === '.svg' &&
                !file.endsWith('-open.svg')
            );
        })
        .map((file) => {
            let iconId = path.parse(file).name; // Get the filename without extension
            iconId = iconId.replace(/^_/, '').replace(/^folder-/, ''); // Remove prefixes
            const iconPrefix = directoryPath.endsWith('folder_icons') ? '📁' : '📄';
            return `${iconPrefix} ${iconId}`;
        });
}

//---------------------------------------------------------------------------------------------------<<

export const showAvailableIcons = async (context: vscode.ExtensionContext) => {
    try {
        const folderIconsDir = path.join(context.extensionPath, 'assets', 'icons', 'folder_icons');
        const fileIconsDir = path.join(context.extensionPath, 'assets', 'icons', 'file_icons');

        const folderIconIds = getIconIdsFromDirectory(folderIconsDir);
        const fileIconIds = getIconIdsFromDirectory(fileIconsDir);

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
        vscode.window.showErrorMessage(
            'An error occurred while showing icons.'
        );
    }
};


