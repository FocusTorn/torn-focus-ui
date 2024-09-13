import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


// Can we do
// If only one item
// (iconID:folder-src) - src
// else
// (iconID:folder-removed)

//     - _removed
//     - _X_removed
//     - _XX_removed
//     - _XXX_removed
//     - removed
//     - X_removed
//     - XX_removed
//     - XXX_removed
// and a line break only after there being multiple items, eg...

// (iconID:folder-src) - src
// (iconID:folder-removed)
//     - _removed
//     - _X_removed
//     - _XX_removed
//     - _XXX_removed
//     - removed
//     - X_removed
//     - XX_removed
//     - XXX_removed












export const showFolderIconAssignment = async (context: vscode.ExtensionContext) => {
    try {



        const baseThemePath = path.join(context.extensionPath, 'themes', 'torn_focus_icons.json');
        const mainThemePath = path.join(context.extensionPath, 'themes', 'torn_focus_icons.json');

        const chosenManifest = await vscode.window.showQuickPick(
            [
                { label: 'Base Theme', manifest: baseThemePath },
                { label: 'Customized Theme', manifest: mainThemePath }
            ],
            { placeHolder: 'Where do you want to apply the icon theme?' }
        );
        if (!chosenManifest) { return; }


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

            // if (folders.length === 1) {
            //     // Single folder: inline format
            //     markdownContent += `(iconID: \`${iconId.replace('_folder-', '')}\`) - \`${folders[0]}\`\n`;
            // } else {
            //     // Multiple folders: list format with line break
            //     markdownContent += `(iconID: \`${iconId.replace('_folder-', '')}\`)\n`;
            //     folders.forEach(folderName => {
            //         markdownContent += `    - \`${folderName}\`\n`;
            //     });
            //     markdownContent += '\n'; // Add an extra line break after the list
            // }


            // Multiple folders: list format with line break
            markdownContent += `(iconID: \`${iconId.replace('_folder-', '')}\`)\n`;
            folders.forEach(folderName => {
                markdownContent += `- ${folderName}\n`;
            });
            markdownContent += '\n'; // Add an extra line break after the list


        }





        const newDocument = await vscode.workspace.openTextDocument({
            content: markdownContent,
            language: 'markdown',
        });

        await vscode.window.showTextDocument(newDocument);

    } catch (error) {
        console.error('Error showing folder icons:', error);
        vscode.window.showErrorMessage(
            'An error occurred while showing folder icons.'
        );
    }
};




// export const showFolderIconAssignment = async (context: vscode.ExtensionContext) => {
//     try {



//         const baseThemePath = path.join(context.extensionPath, 'themes', 'torn_focus_icons.json');
//         const mainThemePath = path.join(context.extensionPath, 'themes', 'torn_focus_icons.json');

//         const chosenManifest = await vscode.window.showQuickPick(
//             [
//                 { label: 'Base Theme', manifest: baseThemePath },
//                 { label: 'Customized Theme', manifest: mainThemePath }
//             ],
//             { placeHolder: 'Where do you want to apply the icon theme?' }
//         );
//         if (!chosenManifest) { return; }


//         const manifest = JSON.parse(fs.readFileSync(chosenManifest.manifest, 'utf-8'));

//         // Create a map to group folder names by icon ID
//         const iconAssignments: { [iconId: string]: string[] } = {};

//         for (const folderName in manifest.folderNames) {
//             const iconId = manifest.folderNames[folderName];
//             if (!iconAssignments[iconId]) {
//                 iconAssignments[iconId] = [];
//             }
//             iconAssignments[iconId].push(folderName);
//         }

//         //- Create markdown --------------------------
//         let markdownContent = '# Available Folder Icons\n\n';

//         for (const iconId in iconAssignments) {
//             markdownContent += `## ${iconId.replace('_folder-', '')}\n\n`;
//             iconAssignments[iconId].forEach(folderName => {
//                 markdownContent += `- \`${folderName}\`\n`;
//             });
//             markdownContent += '\n';
//         }


//         const newDocument = await vscode.workspace.openTextDocument({
//             content: markdownContent,
//             language: 'markdown',
//         });

//         await vscode.window.showTextDocument(newDocument);

//     } catch (error) {
//         console.error('Error showing folder icons:', error);
//         vscode.window.showErrorMessage(
//             'An error occurred while showing folder icons.'
//         );
//     }
// };



// export const showFolderIconAssignment = async (context: vscode.ExtensionContext) => {
//     try {
//         const baseThemePath = path.join(context.extensionPath, 'themes', 'torn_focus_icons.json');
//         const mainThemePath = path.join(context.extensionPath, 'themes', 'torn_focus_icons.json');

//         const chosenManifest = await vscode.window.showQuickPick(
//             [
//                 { label: 'Base Theme', manifest: baseThemePath },
//                 { label: 'Customized Theme', manifest: mainThemePath }
//             ],
//             { placeHolder: 'Where do you want to apply the icon theme?' }
//         );
//         if (!chosenManifest) { return; }

//         const manifest = JSON.parse(fs.readFileSync(chosenManifest.manifest, 'utf-8'));

//         const folderIcons = Object.keys(manifest.folderNames).map((key) => {
//             return `- \`${key}\` (icon ID: \`${manifest.folderNames[key]}\`)`;
//         });

//         const markdownContent = `# Available Folder Icons\n\n${folderIcons.join(
//             '\n'
//         )}`;

//         const newDocument = await vscode.workspace.openTextDocument({
//             content: markdownContent,
//             language: 'markdown',
//         });

//         await vscode.window.showTextDocument(newDocument);
//     } catch (error) {
//         console.error('Error showing folder icons:', error);
//         vscode.window.showErrorMessage(
//             'An error occurred while showing folder icons.'
//         );
//     }
// };





