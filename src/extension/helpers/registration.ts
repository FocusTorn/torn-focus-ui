import * as vscode from 'vscode';
import { Uri, commands } from 'vscode';
import { constants } from '../../config/index';

import { activateIconTheme } from '../../extension/commands/activateIconTheme';
import { showAvailableIcons } from '../../extension/commands/showAvailableIcons';
import { showFolderIconAssignment } from '../../extension/commands/showFolderIconAssignment';
import { updateTerminalPath } from '../../extension/commands/terminalCommands';
import { assignIcon, revertIcon } from '../../extension/commands/assignIcon';
import { toggleIcons } from '../../extension/commands/toggleIcons';
import { toggleExplorerArrows } from '../../extension/commands/explorerArrows';



export const registered: vscode.Disposable[] = [];


////////////////////////////////////////////////////////////////////
////  Commands with arguments
////////////////////////////////////////////////////////////////////
registered.push(commands.registerCommand(
    'torn-focus-ui.updateTerminalPath',
    async (uri: Uri) => { updateTerminalPath(uri); }
));

registered.push(commands.registerCommand(
    'torn-focus-ui.assignIcon',
    async (uri: Uri) => { assignIcon(uri); }
));

registered.push(commands.registerCommand(
    'torn-focus-ui.revertIcon',
    async (uri: Uri) => { revertIcon(uri); }
));





////////////////////////////////////////////////////////////////////
////  Command with function reference
////////////////////////////////////////////////////////////////////

/*
    const extensionRefCommands: { [command: string]: () => Promise<void> } = {
        "commandID": functionName

    };

    Object.keys(extensionRefCommands).forEach((commandName) => {
        registered.push(
            vscode.commands.registerCommand(`${constants.extension.name}.${commandName}`, () => {
                extensionRefCommands[commandName]();
            })
        );
    });
*/


// ////////////////////////////////////////////////////////////////////
// ////  Command with no arguments or function reference
// ////////////////////////////////////////////////////////////////////
// const extensionCommands: Record<string, () => Promise<void>> = {
//     activateIconTheme,
//     showAvailableIcons,
//     showFolderIconAssignment,
//     toggleIcons

// };

// for (const commandName in extensionCommands) {
//     registered.push(
//         vscode.commands.registerCommand(`${constants.extension.name}.${commandName}`, () => {
//             extensionCommands[commandName]();
//         })
//     );
// }






export function registerCommands(context: vscode.ExtensionContext) {
    const registered: vscode.Disposable[] = [];
    const extensionCommands: Record<string, (context: vscode.ExtensionContext) => Promise<void>> = {
        showFolderIconAssignment,
        toggleIcons,
        activateIconTheme,
        showAvailableIcons,
        toggleExplorerArrows

    };

    for (const commandName in extensionCommands) {
        registered.push(
            vscode.commands.registerCommand(`${constants.extension.name}.${commandName}`, () => {
                // Pass the context to the command handler
                extensionCommands[commandName](context);
            })
        );
    }

    return registered;
}




























// export const registered: vscode.Disposable[] = [];

// registered.push(
//     vscode.commands.registerCommand('torn-focus-ui.updateTerminalPath', async (uri: vscode.Uri) => {
//         updateTerminalPath(uri); // Pass the uri to your function
//     })
// );




// const extensionCommands: { [command: string]: () => Promise<void> } = {
//     activateIconTheme
// };

// export const registered = Object.keys(extensionCommands).map((commandName) => {
//     const callCommand = () => extensionCommands[commandName]();

//     // window.showInformationMessage(`Command Name: ${constants.extension.name}.${commandName}`); // Show a message box
//     // console.log(`Command Name: ${constants.extension.name}.${commandName}`); // Log to the console

//     return commands.registerCommand(
//         `${constants.extension.name}.${commandName}`,
//         callCommand
//     );
// });












// export const registered = Object.keys(extensionCommands).map((commandName) => {
//     const callCommand = () => {
//         // --- DEBUG LOGS (NOW INSIDE THE FUNCTION) ---
//         window.showInformationMessage(`Command Name: ${extensionName}.${commandName}`);
//         console.log(`Command Name: ${extensionName}.${commandName}`);

//         extensionCommands[commandName]();
//     };

//     // Command name is now constructed when the command is executed
//     return commands.registerCommand(`${extensionName}.${commandName}`, callCommand);
// });
