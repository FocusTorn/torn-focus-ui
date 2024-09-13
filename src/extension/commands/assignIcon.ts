import * as path from 'path';
import * as fs from 'fs';
import { workspace, window, Uri, ConfigurationTarget } from 'vscode';


const fileIconsDir = path.join(__dirname,'..', '..', '..','assets', 'icons', 'file_icons');
const folderIconsDir = path.join(__dirname,'..', '..', '..','assets', 'icons', 'folder_icons');





export const assignIcon = async (fileUri: Uri) => {
    try {
        let iconChosen: string | undefined = '';

        const fileIconOptions = getIconOptionsFromDirectory(fileIconsDir);
        const folderIconOptions = getIconOptionsFromDirectory(folderIconsDir, file => !file.endsWith('-open.svg'));

        const isFile = fs.statSync(fileUri.fsPath).isFile();
        const iconOptions = isFile ? fileIconOptions : folderIconOptions;
        const chosenExplorerItem = path.basename(fileUri.fsPath);

        const selectedIcon = await window.showQuickPick(iconOptions, {
            placeHolder: 'Select an icon',
        });

        if (selectedIcon) {
            iconChosen = selectedIcon.label;
            const config = workspace.getConfiguration('TornFocusUi.themes');
            const currentCustomIcons: { [key: string]: any } = config.get('customIcons', {}) || {};
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



export const revertIcon = async (fileUri: Uri) => {
    try {
        const chosenExplorerItem = path.basename(fileUri.fsPath);
        const config = workspace.getConfiguration('TornFocusUi.themes');
        const currentCustomIcons: { [key: string]: any } = config.get('customIcons', {}) || {};
        const updatedCustomIcons = { ...currentCustomIcons };
        delete updatedCustomIcons[chosenExplorerItem];

        await config.update('customIcons', updatedCustomIcons, ConfigurationTarget.Global);

    } catch (error) {
        console.error('Error reading icons directory:', error);
        window.showErrorMessage('An error occurred while loading icons.');
    }
};



function getIconOptionsFromDirectory(directoryPath: string, additionalFilter?: (file: string) => boolean): { label: string; description?: string; iconPath?: Uri }[] {

    const iconFiles = fs.readdirSync(directoryPath);

    return iconFiles
        .filter(file => path.extname(file).toLowerCase() === '.svg') // Always filter for SVG
        .filter(file => additionalFilter ? additionalFilter(file) : true) // Apply additional filter if provided
        .map(file => ({
            label: path.basename(file, '.svg').replace(/^_/, '').replace(/^folder-/, ''),
            iconPath: Uri.file(path.join(directoryPath, file))
        }));
}
















// export const assignIcon = (fileUri: Uri) => {
//     return assignIcon_fn(fileUri);
// };

// const assignIcon_fn = async (fileUri: Uri) => {




 // //- Choice for Restore or Assign -------------
        // const actionChoices = ['Assign New Icon', 'Restore Default Icon'];
        // const chosenAction = await window.showQuickPick(actionChoices, {
        //     placeHolder: 'Choose an action',
        // });
        // if (!chosenAction) {
        //     return;
        // }





         // if (chosenAction === 'Assign New Icon') {
            // const selectedIcon = await window.showQuickPick(iconOptions, {
            //     placeHolder: 'Select an icon',
            // });

            // if (selectedIcon) {
            //     iconChosen = selectedIcon.label;
            //     const config = workspace.getConfiguration('TornFocusUi.themes');
            //     const currentCustomIcons: { [key: string]: any } = config.get('customIcons', {}) || {};
            //     currentCustomIcons[chosenExplorerItem] = iconChosen;
            //     await config.update('customIcons', currentCustomIcons, ConfigurationTarget.Global);
            // } else {
            //     console.log('No icon selected.');
            // }

        // } else if (chosenAction === 'Restore Default Icon') {
        //     const config = workspace.getConfiguration('TornFocusUi.themes');
        //     const currentCustomIcons: { [key: string]: any } = config.get('customIcons', {}) || {};

        //     const updatedCustomIcons = { ...currentCustomIcons };
        //     delete updatedCustomIcons[chosenExplorerItem];

        //     await config.update('customIcons', updatedCustomIcons, ConfigurationTarget.Global);
        // }
