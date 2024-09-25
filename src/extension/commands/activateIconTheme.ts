import { ConfigurationTarget, window as codeWindow } from 'vscode';
import { constants, getConfig } from '../../config/index';

/**
 * 
 * 
 * 
 * Activates the Torn Focus UI icon theme.
 *
 * This function prompts the user to choose whether to apply the icon theme globally or
 * for the current workspace. It then updates the VS Code settings to activate the theme.
 * If the theme activation fails, an error message is displayed. Otherwise, a success
 * message is shown.
 */
export const activateIconTheme = async () => {
    try {
        const config = getConfig();
        const section = 'workbench.iconTheme';

        const chosenTarget = await codeWindow.showQuickPick(
            [
                { label: 'Globally', target: ConfigurationTarget.Global },
                { label: 'For this Workspace', target: ConfigurationTarget.Workspace },
            ],
            { placeHolder: 'Where do you want to apply the icon theme?' }
        );
        if (!chosenTarget) {
            return;
        }

        await config.update(section, constants.extension.name, chosenTarget.target);

        if (
            getConfig().inspect(section)?.[
                chosenTarget.target === ConfigurationTarget.Global ? 'globalValue' : 'workspaceValue'
            ] !== constants.extension.name
        ) {
            codeWindow.showErrorMessage(`Failed to set icon theme ${chosenTarget.label.toLowerCase()}.`);
            return;
        }
        codeWindow.showInformationMessage(`Icon theme activated ${chosenTarget.label.toLowerCase()}!`);
    } catch (error) {
        console.error(error);
        codeWindow.showErrorMessage('An error occurred while activating the icon theme.');
    }
};
