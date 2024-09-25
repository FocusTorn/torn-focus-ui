import { ConfigurationTarget, workspace } from 'vscode';

/**
 *
 *
 *
 * Toggles the active icon theme on and off.
 *
 * This function retrieves the currently active icon theme and then toggles it off and on again.
 * This effectively refreshes the icon theme, which can be useful for resolving display issues.
 */
export const toggleIcons = async () => {
    const currentTheme = workspace.getConfiguration('workbench').get<string>('iconTheme');

    workspace
        .getConfiguration('workbench')
        .update('iconTheme', null, ConfigurationTarget.Global)
        .then(() => {
            workspace.getConfiguration('workbench').update('iconTheme', currentTheme, ConfigurationTarget.Global);
        });
};
