import { type QuickPickItem, window as codeWindow } from 'vscode';
import { setThemeConfig, getConfigValue } from '../../config/configurationActions';

/**
 *
 *
 *
 * Toggles the visibility of folder arrows in the explorer panel.
 * It retrieves the current status of explorer arrows, presents a QuickPick menu to the user,
 * and handles the user's selection to either show or hide the arrows.
 */

export const toggleExplorerArrows = async () => {
    try {
        const status = areExplorerArrowsHidden();

        console.log(status);

        const response = await showQuickPickItems(status);
        return handleQuickPickActions(response);
    } catch (error) {
        console.error(error);
    }
};

/**
 *
 *
 *
 * Displays a QuickPick menu with options to turn explorer arrows on or off.
 * The menu item representing the current state is pre-selected.
 *
 * @param status - The current status of explorer arrows (true if hidden, false if visible).
 * @returns A promise that resolves to the selected QuickPickItem or undefined if none is selected.
 */

const showQuickPickItems = (status: boolean): Thenable<QuickPickItem | undefined> => {
    const on: QuickPickItem = {
        description: 'On',
        detail: 'Display folder arrows in explorer panel',
        label: !status ? '\u2714' : '\u25FB',
    };
    const off: QuickPickItem = {
        description: 'Off',
        detail: 'Hide folder arrows in explorer panel',
        label: status ? '\u2714' : '\u25FB',
    };

    return codeWindow.showQuickPick([on, off], {
        placeHolder: 'PHolder',
        ignoreFocusOut: false,
        matchOnDescription: true,
    });
};

/**
 *
 *
 *
 * Handles the user's selection from the QuickPick menu for explorer arrows.
 * It updates the theme configuration based on the chosen option.
 *
 * @param value - The selected QuickPickItem from the menu.
 * @returns A promise that resolves when the configuration is updated.
 */

const handleQuickPickActions = (value: QuickPickItem | undefined) => {
    if (!value?.description) {
        return;
    }
    switch (value.description) {
        case 'On': {
            return setThemeConfig('themes.hidesExplorerArrows', false, true);
        }
        case 'Off': {
            return setThemeConfig('themes.hidesExplorerArrows', true, true);
        }
        default:
            return;
    }
};

/**
 *
 *
 *
 * Checks if the explorer arrows are currently hidden.
 *
 * @returns True if explorer arrows are hidden, false otherwise.
 */

export const areExplorerArrowsHidden = (): boolean => {
    const hidesExplorerArrows = getConfigValue('themes.hidesExplorerArrows');
    return hidesExplorerArrows === true;
};
