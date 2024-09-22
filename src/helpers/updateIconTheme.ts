import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { ConfigurationTarget, window as codeWindow } from 'vscode';
import { getConfig } from '../config/index';


interface BaseThemeData {
    fileExtensions: { [key: string]: string };
    fileNames: { [key: string]: string };
    folderNames: { [key: string]: string };
    folderNamesExpanded: { [key: string]: string };
}


interface CustomIcons {
    [key: string]: string;
}


export function updateIconThemeNoWorkspace(context: vscode.ExtensionContext) {
    try {
        const baseThemePath = path.join(context.extensionPath, 'assets', 'themes', 'base_theme.json');
        const outputThemePath = path.join(context.extensionPath, 'assets', 'themes', 'torn_focus_icons.json');
        const baseThemeData: BaseThemeData = JSON.parse(fs.readFileSync(baseThemePath, 'utf-8'));
        const customIcons: CustomIcons = vscode.workspace.getConfiguration('TornFocusUi.themes').get('customIcons', {});

        for (const itemName in customIcons) {
            updateBaseTheme(baseThemeData, itemName, customIcons[itemName]);
        }
        fs.writeFileSync(outputThemePath, JSON.stringify(baseThemeData, null, 2));
    } catch (error) {
        console.error('Error updating icon theme:', error);
        vscode.window.showErrorMessage('An error occurred while updating the icon theme.');
    }
}


function updateBaseTheme(baseThemeData: BaseThemeData, itemName: string, iconName: string) {
    if (itemName.startsWith('*.') && itemName.length > 2) {
        baseThemeData.fileExtensions[itemName.slice(2)] = `_${iconName}`;
    } else if (itemName.includes('.')) {
        baseThemeData.fileNames[itemName] = `_${iconName}`;
    } else {
        baseThemeData.folderNames[itemName] = `_folder-${iconName}`;
        baseThemeData.folderNamesExpanded[itemName] = `_folder-${iconName}-open`;
    }
}


// export async function updateHidesExplorerArrows(hideArrows: boolean) {

export const updateHidesExplorerArrows = async (hideArrows: boolean) => {
    try {
        const config = getConfig();
        const section = 'TornFocusUi.themes.hidesExplorerArrows';

        const chosenTarget = await codeWindow.showQuickPick(
            [
                { label: 'Globally', target: ConfigurationTarget.Global },
                { label: 'For this Workspace', target: ConfigurationTarget.Workspace }
            ],
            { placeHolder: 'Where do you want to apply the icon theme?' }
        );
        if (!chosenTarget) { return; }

        await config.update(section, hideArrows, chosenTarget.target);

        const activeSetting = getConfig().inspect(section)?.[chosenTarget.target === ConfigurationTarget.Global ? 'globalValue' : 'workspaceValue'];
        if (activeSetting !== hideArrows) {
            codeWindow.showErrorMessage(`Failed to toggle folder arrows: ${chosenTarget.label.toLowerCase()}.`);
            return;
        }

        const infoMessage = activeSetting !== true ? `Folder arrows are hidden ${chosenTarget.label.toLowerCase()}!`: `Folder arrows are visable ${chosenTarget.label.toLowerCase()}!`;
        codeWindow.showInformationMessage(infoMessage);

    } catch (error) {
        console.error(error);
        codeWindow.showErrorMessage('An error occurred while toggling folder arrows.');
    }

    // try {
    //     const iconThemePath = path.join( __dirname, '..',  'assets', 'themes', 'torn_focus_icons.json' );
    //     const iconThemeData = JSON.parse(fs.readFileSync(iconThemePath, 'utf-8'));

    //     iconThemeData.hidesExplorerArrows = hideArrows;
    //     fs.writeFileSync(iconThemePath, JSON.stringify(iconThemeData, null, 2));

    // } catch (error) {
    //     console.error('Error toggling explorer arrows:', error);
    // }

};


















// export async function toggleExplorerArrows() {
//     try {

//         // 1. Get the path to your icon theme's package.json
//         const extensionPath = vscode.extensions.getExtension('your-extension-id')?.extensionPath;
//         if (!extensionPath) {
//             throw new Error('Could not determine extension path.');
//         }
//         const themePackageJsonPath = path.join(extensionPath, 'package.json');


//         // 2. Read the package.json file
//         const packageJsonContent = await fs.promises.readFile(themePackageJsonPath, 'utf-8');
//         const packageJson = JSON.parse(packageJsonContent);

//         // 3. Toggle the "hidesExplorerArrows" property
//         packageJson.contributes.iconThemes[0].hidesExplorerArrows =
//             !packageJson.contributes.iconThemes[0].hidesExplorerArrows;

//         // 4. Write the updated package.json back to the file
//         await fs.promises.writeFile(themePackageJsonPath, JSON.stringify(packageJson, null, 2));

//         // // 5. (Optional) Prompt the user to reload VS Code
//         // const reloadChoice = await vscode.window.showInformationMessage(
//         //     'Explorer arrow visibility toggled. Reload to apply changes?',
//         //     'Reload'
//         // );
//         // if (reloadChoice === 'Reload') {
//         //     vscode.commands.executeCommand('workbench.action.reloadWindow');
//         // }

//     } catch (error) {
//         console.error('Error toggling explorer arrows:', error);
//         vscode.window.showErrorMessage('An error occurred while toggling explorer arrows.');
//     }
// }



// //--- updateIconThemeNoWorkspace -------------------------------------------------------------------->>


// export function updateIconThemeNoWorkspace(context: vscode.ExtensionContext) {
//     try {
//         // Set theme file paths
//         const baseThemePath = path.join(context.extensionPath, 'assets', 'themes', 'base_theme.json');
//         const outputThemePath = path.join(context.extensionPath, 'assets', 'themes',  'torn_focus_icons.json');

//         // Get the base theme data from base_theme.json
//         const baseThemeData = JSON.parse(fs.readFileSync(baseThemePath, 'utf-8'));

//         // Get custom icon assignments from settings.json
//         const customIcons: { [key: string]: { [key: string]: string } } = vscode.workspace.getConfiguration('TornFocusUi.themes').get('customIcons', {});

//         // Merge custom icons into the base theme
//         for (const itemName in customIcons) {
//             const iconName = customIcons[itemName];

//             if (itemName.startsWith('*.') && itemName.length > 2) {
//                 // File extension (remove the "*.")
//                 baseThemeData.fileExtensions[itemName.slice(2)] = `_${iconName}`;
//             } else if (itemName.includes('.')) {
//                 // File name
//                 baseThemeData.fileNames[itemName] = `_${iconName}`;
//             } else {
//                 // Folder icon
//                 baseThemeData.folderNames[itemName] = `_folder-${iconName}`;
//                 baseThemeData.folderNamesExpanded[itemName] = `_folder-${iconName}-open`;
//             }
//         }

//         // Write the updated theme to primary theme
//         fs.writeFileSync(outputThemePath, JSON.stringify(baseThemeData, null, 2));

//         //> 5. (Optional) Prompt the user to reload VS Code
//         // const reloadChoice = await vscode.window.showInformationMessage(
//         //     'Icon theme updated. Reload to apply changes?',
//         //     'Reload'
//         // );
//         // if (reloadChoice === 'Reload') {
//         //     vscode.commands.executeCommand('workbench.action.reloadWindow');
//         // }
//         //<

//     } catch (error) {
//         console.error('Error updating icon theme:', error);
//         vscode.window.showErrorMessage('An error occurred while updating the icon theme.');
//     }
// }








//---------------------------------------------------------------------------------------------------<<

// //--- updateIconThemeWithWorkspace   ---------------------------------------------------------------->>


// export async function updateIconThemeWithWorkspace(context: vscode.ExtensionContext) {

//     const customIcons: { [key: string]: { [key: string]: string } } = vscode.workspace.getConfiguration('TornFocusUi.themes').get('customIcons', {});

//     const baseThemePath = path.join(context.extensionPath, 'assets', 'themes', 'base_theme.json');
//     const outputThemePath = path.join(context.extensionPath,'assets',  'themes', 'torn_focus_icons.json');

//     console.log(`Info: baseThemePath = ${baseThemePath ? baseThemePath : 'undefined'}`);

//     try {
//         const baseThemeData = await fs.promises.readFile(baseThemePath, 'utf-8');
//         const baseTheme = JSON.parse(baseThemeData);

//         // Merge custom icons into base theme
//         for (const workspaceName in customIcons) {
//             const workspaceIcons = customIcons[workspaceName];
//             for (const itemName in workspaceIcons) {
//                 const iconName = workspaceIcons[itemName];

//                 if (itemName.startsWith('*.') && itemName.length > 2) {
//                     // File extension (remove the "*.")
//                     baseTheme.fileExtensions[itemName.slice(2)] = `_${iconName}`;
//                 } else if (itemName.includes('.')) {
//                     // File name
//                     baseTheme.fileNames[itemName] = `_${iconName}`;
//                 } else {
//                     // Folder icon
//                     baseTheme.folderNames[itemName] = `_folder-${iconName}`;
//                     baseTheme.folderNamesExpanded[itemName] = `_folder-${iconName}-open`;
//                 }
//             }
//         }

//         // Write the updated theme to torn_focus_icons.json
//         await fs.promises.writeFile(outputThemePath, JSON.stringify(baseTheme, null, 4));


//         // --- Icon Refresh Logic (Adapted from renameIconFiles) ---

//         const iconFolderPath = path.join(context.extensionPath, 'assets', 'icons', 'file_icons');
//         const files = fs.readdirSync(iconFolderPath).filter(f => f.endsWith('ip.svg'));

//         for (const file of files) {
//             const filePath = path.join(iconFolderPath, file);

//             // const newFilePath = filePath + '.tmp'; // Temporary filename
//             const parsedPath = path.parse(filePath); // Break down the path
//             const newFilePath = path.format({
//                 dir: parsedPath.dir,
//                 name: parsedPath.name + '_temp', // Add _temp to the filename
//                 ext: parsedPath.ext
//             });

//             try {
//                 fs.renameSync(filePath, newFilePath);
//                 console.log(`Renamed icon to tmp: ${path.basename(newFilePath)}`);
//             } catch (error) {
//                 console.error(`Error renaming icon to tmp ${path.basename(newFilePath)}:`, error);
//             }
//         }

//         for (const file of files) {
//             const filePath = path.join(iconFolderPath, file);

//             // const newFilePath = filePath + '.tmp'; // Temporary filename
//             const parsedPath = path.parse(filePath); // Break down the path
//             const newFilePath = path.format({
//                 dir: parsedPath.dir,
//                 name: parsedPath.name + '_temp', // Add _temp to the filename
//                 ext: parsedPath.ext
//             });

//             try {
//                 fs.renameSync(newFilePath, filePath);
//                 console.log(`Renamed icon: ${path.basename(filePath)}`);
//             } catch (error) {
//                 console.error(`Error renaming icon ${path.basename(filePath)}:`, error);
//             }
//         }







//         // --- End of Icon Refresh Logic ---

















//         // // Optionally, prompt the user to reload VS Code for the changes to take effect
//         // const reload = await vscode.window.showInformationMessage(
//         //     'Icon theme updated. Reload VS Code to apply changes?',
//         //     'Reload'
//         // );
//         // if (reload === 'Reload') {
//         //     vscode.commands.executeCommand('workbench.action.reloadWindow');
//         // }

//         //refreshIcons(context);


//     } catch (error) {
//         console.error('Error updating icon theme:', error);
//         vscode.window.showErrorMessage('Failed to update icon theme.');
//     }
// }




// //---------------------------------------------------------------------------------------------------<<































//- refreshIcons ------------------------------------------------->>



// function refreshIcons(context: vscode.ExtensionContext) {
//     if (context) {
//         // Call deactivate() directly, then reactivate
//         deactivate()
//             .then(() => {
//                 context.activate();
//             });
//     } else {
//         console.error('Could not get extension context');
//     }
// }











// function refreshIcons(context: vscode.ExtensionContext) {
//     const wb = vscode.workspace.getConfiguration('workbench');
//     const currentTheme = wb.get<string>('iconTheme');

//     // Get the current extension context
//     // const extensionContext = vscode.extensions.getExtension('torn-focus-ui')?.extensionContext;

//     if (context) {
//         // Deactivate and reactivate the extension
//         context.deactivate().then(() => {
//             context.activate();
//         });
//     } else {
//         console.error('Could not get extension context for torn-focus-ui');
//     }
// }









// function refreshIcons_OG() {
//     const wb = vscode.workspace.getConfiguration('workbench');
//     const currentTheme = wb.get<string>('iconTheme');

//     // Briefly switch to a different theme (any theme will do)
//     // vscode.workspace.getConfiguration('workbench').update('iconTheme', 'vs-minimal', vscode.ConfigurationTarget.Global).then(() => {
//     vscode.workspace.getConfiguration('workbench').update('iconTheme', null, vscode.ConfigurationTarget.Global)
//         .then(() => {
//             // Switch back to the original theme
//             vscode.workspace.getConfiguration('workbench').update('iconTheme', currentTheme, vscode.ConfigurationTarget.Global);
//     });
// }



//----------------------------------------------------------------<<









// let outputChannel: vscode.OutputChannel;
// export async function updateIconTheme(context: vscode.ExtensionContext) {
//     outputChannel = vscode.window.createOutputChannel('Torn Focus UI');
//     outputChannel.show(true); // Optionally show the Output panel

//     outputChannel.appendLine('Update: 02'); // Example output







//     // const baseThemePath = path.join( context.extensionPath, 'themes', 'base_theme.json');
//     // const outputThemePath = path.join(context.extensionPath, 'themes', 'torn_focus_icons2.json');


//     const baseThemePath = path.join(__dirname, '..', '..', 'themes', 'base_theme.json');
//     const outputThemePath = path.join(__dirname, '..', '..', 'themes', 'torn_focus_icons.json');






//     outputChannel.appendLine(`Output Theme Path: ${outputThemePath}`);

//     const config = vscode.workspace.getConfiguration('TornFocusUi.themes');
//     // const customIcons: { [key: string]: string } = config.get('customIcons', {});


//     const customIcons: { [key: string]: { [key: string]: string } } = config.get('customIcons', {});

//     const baseTheme = JSON.parse(fs.readFileSync(baseThemePath, 'utf-8'));

//     // Clear existing custom mappings to avoid duplicates
//     baseTheme.fileExtensions = { ...baseTheme.fileExtensions }; // Keep default file extensions
//     baseTheme.fileNames = { ...baseTheme.fileNames }; // Clear custom file names
//     baseTheme.folderNames = { ...baseTheme.folderNames }; // Keep default folder names
//     baseTheme.folderNamesExpanded = { ...baseTheme.folderNamesExpanded }; // Keep default folder names (expanded)

//     for (const workspaceName in customIcons) {
//         const workspaceIcons = customIcons[workspaceName];

//         for (const itemName in workspaceIcons) {
//             const iconId = workspaceIcons[itemName];

//             if (itemName.includes('.') && itemName.startsWith('*.') && itemName.length > 2) {
//                 const extension = itemName.slice(2);
//                 baseTheme.fileExtensions = { ...baseTheme.fileExtensions, [extension]: `_${iconId}` };
//             } else if (itemName.includes('.')) {
//                 baseTheme.fileNames = { ...baseTheme.fileNames, [itemName]: `_${iconId}` };
//             } else {
//                 baseTheme.folderNames = { ...baseTheme.folderNames, [itemName]: `_folder-${iconId}` };
//                 baseTheme.folderNamesExpanded = { ...baseTheme.folderNamesExpanded, [itemName]: `_folder-${iconId}-open` };
//             }
//         }
//     }

//     try {

//         await fs.promises.writeFile(outputThemePath, JSON.stringify(baseTheme, null, 2));

//             // vscode.window.showInformationMessage(`File writing is complete`);
//             outputChannel.appendLine('File writing is complete');

//         // fs.writeFile(outputThemePath, JSON.stringify(baseTheme, null, 2), (err) => {
//         //     if (err) {
//         //         console.error("Error writing icon theme file:", err);
//         //         // Handle the error appropriately (e.g., show an error message)
//         //     } else {

//         //         vscode.window.showInformationMessage(`File writing is complete`);

//         //         // File writing is complete, NOW reload the theme
//         //         // refreshIcons();
//         //     }
//         // });

//     } catch (err: unknown) {
//         console.error("Error writing icon theme file:", err);
//         outputChannel.appendLine(`Error writing icon theme file: ${(err as Error).message}`);
//         vscode.window.showErrorMessage(`Failed to create icon theme file: ${(err as Error).message}`);
//     }


//     // fs.writeFileSync(outputThemePath, JSON.stringify(baseTheme, null, 2));

//     // refreshIcons();
// }


































// for (const key in customIcons) {
//     const iconId = customIcons[key];
//     if (key.includes('.') && key.startsWith('*.') && key.length > 2) {
//         const extension = key.slice(2);
//         baseTheme.fileExtensions[extension] = `_${iconId}`;
//     } else if (key.includes('.')) {
//         baseTheme.fileNames[key] = `_${iconId}`;
//     } else {
//         baseTheme.folderNames[key] = `_folder-${iconId}`;
//         baseTheme.folderNamesExpanded[key] = `_folder-${iconId}-open`; // Apply to both collapsed and expanded states
//     }
// }














// function updateIconTheme() {
//     const config = vscode.workspace.getConfiguration('TornFocusUi.themes');
//     const customFileIcons = config.get('customFileIcons', {});
//     const customFolderIcons = config.get('customFolderIcons', {});

//     const baseTheme = JSON.parse(fs.readFileSync(baseThemePath, 'utf-8'));

//     // Merge custom file icons
//     baseTheme.fileExtensions = { ...baseTheme.fileExtensions, ...customFileIcons };
//     // Merge custom folder icons
//     baseTheme.folderNames = { ...baseTheme.folderNames, ...customFolderIcons };
//     baseTheme.folderNamesExpanded = { ...baseTheme.folderNamesExpanded, ...customFolderIcons };

//     fs.writeFileSync(outputThemePath, JSON.stringify(baseTheme, null, 2));
// }
