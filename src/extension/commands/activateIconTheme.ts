import { ConfigurationTarget, window as codeWindow } from 'vscode';
import { constants, getConfig } from '../../config/index';


// export const activateIconTheme = () => {
//     return activateIconTheme_fn();
// };

// const activateIconTheme_fn = async () => {

export const activateIconTheme = async () => {



    try {
        const config = getConfig();
        const section = 'workbench.iconTheme';

        const chosenTarget = await codeWindow.showQuickPick(
            [
                { label: 'Globally', target: ConfigurationTarget.Global },
                { label: 'For this Workspace', target: ConfigurationTarget.Workspace }
            ],
            { placeHolder: 'Where do you want to apply the icon theme?' }
        );
        if (!chosenTarget) { return; }

        await config.update(section, constants.extension.name, chosenTarget.target);

        if (getConfig().inspect(section)?.[chosenTarget.target === ConfigurationTarget.Global ? 'globalValue' : 'workspaceValue'] !== constants.extension.name) {
            codeWindow.showErrorMessage(`Failed to set icon theme ${chosenTarget.label.toLowerCase()}.`);
            return;
        }
        codeWindow.showInformationMessage(`Icon theme activated ${chosenTarget.label.toLowerCase()}!`);

    } catch (error) {
        console.error(error);
        codeWindow.showErrorMessage('An error occurred while activating the icon theme.');
    }
};







// In my src/extension/commands/activateIconTheme.ts

// Why does this work importing from src/config/constants.ts
// import { constants } from '../../config/constants';

// but this throws an error importing from
// import { constants } from '../../config/index';


// config/constants file:
// D:\z Linked from C\Documents\!Mike\!Dev\VSC_Extensions\extensions\torn-focus-ui\src\config\constants.ts

// config/index file:
// D:\z Linked from C\Documents\!Mike\!Dev\VSC_Extensions\extensions\torn-focus-ui\src\config\index.ts












// const setIconTheme = async () => {
//     try {
//         const config = getConfig();
//         const section = 'workbench.iconTheme';

//         // Determine the appropriate ConfigurationTarget (global or workspace)
//         const target = config.inspect(section)?.globalValue === undefined
//             ? ConfigurationTarget.Global // If no global value, set globally
//             : ConfigurationTarget.Workspace; // Otherwise, set for the workspace

//         await config.update(section, constants.extension.name, target);

//         // Verify if the update was successful
//         if (getConfig().inspect(section)?.[target === ConfigurationTarget.Global ? 'globalValue' : 'workspaceValue'] !== constants.extension.name) {
//             // Provide a more specific error message based on the target
//             codeWindow.showErrorMessage(`Failed to set icon theme ${target === ConfigurationTarget.Global ? 'globally' : 'for this workspace'}.`);
//             return;
//         }

//         codeWindow.showInformationMessage('Icon theme activated successfully!');
//     } catch (error) {
//         console.error(error);
//         codeWindow.showErrorMessage('An error occurred while activating the icon theme.');
//     }
// };






















// export const activateIconTheme = () => {
//     return setIconTheme();
// };

// const getConfig = (section?: string) => {
//     return workspace.getConfiguration(section);
// };

// const setIconTheme = async () => {
//     try {
//         const section = 'workbench.iconTheme';
//         await getConfig().update(section, constants.extension.name, true);

//         if (getConfig().inspect(section)?.workspaceValue) {
//             getConfig().update(section, constants.extension.name);
//         }

//     } catch (error) {
//         console.error(error);
//     }

// };










// const setIconTheme = async () => {
//     try {
//         const config = getConfig();
//         const section = 'workbench.iconTheme';

//         // Try global first
//         await config.update(section, constants.extension.name, ConfigurationTarget.Global);

//         // Check if the update was successful globally
//         if (getConfig().inspect(section)?.globalValue !== constants.extension.name) {
//             // If not successful globally, prompt for workspace
//             const shouldSetWorkspace = await codeWindow.showInformationMessage(
//                 'Could not set icon theme globally. Set for this workspace instead?',
//                 'Yes',
//                 'No'
//             );

//             if (shouldSetWorkspace === 'Yes') {
//                 await config.update(section, constants.extension.name, ConfigurationTarget.Workspace);
//             } else {
//                 // User declined or an error occurred
//                 codeWindow.showErrorMessage('Icon theme not activated.');
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         codeWindow.showErrorMessage('An error occurred while activating the icon theme.');
//     }
// };












// const setIconTheme = async () => {
//     try {
//         const config = getConfig(); // Get config first
//         const section = 'workbench.iconTheme';
//         await config.update(section, constants.extension.name, true);
//     } catch (error) {
//         console.error(error);
//         // Consider showing an error message to the user here
//         codeWindow.showErrorMessage('An error occurred while activating the icon theme.');
//     }
// };


// const setIconTheme = async () => {
//     try {
//         const section = 'workbench.iconTheme';
//         await getConfig().update(section, constants.extension.name, true); // Single update for both global and workspace
//     } catch (error) {
//         console.error(error);
//     }
// };
