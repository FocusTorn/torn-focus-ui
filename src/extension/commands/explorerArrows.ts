
import { type QuickPickItem, window as codeWindow } from 'vscode';
import { setThemeConfig, getConfigValue } from '../../config/configurationActions';

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

const handleQuickPickActions = (value: QuickPickItem | undefined) => {
    if (!value?.description) { return; }
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


export const areExplorerArrowsHidden = (): boolean => {
    const hidesExplorerArrows = getConfigValue('themes.hidesExplorerArrows');
    return hidesExplorerArrows === true;
};

