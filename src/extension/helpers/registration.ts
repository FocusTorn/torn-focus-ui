import { Disposable, ExtensionContext, Uri, commands } from 'vscode';
import { constants } from '../../config/index';

import { activateIconTheme } from '../../extension/commands/activateIconTheme';
import { showAvailableIcons } from '../../extension/commands/showAvailableIcons';
import { showFolderIconAssignment } from '../../extension/commands/showFolderIconAssignment';
import { updateTerminalPath } from '../commands/terminalCommands';
import { assignIcon, revertIcon } from '../../extension/commands/assignIcon';
import { toggleIcons } from '../../extension/commands/toggleIcons';
import { toggleExplorerArrows } from '../../extension/commands/explorerArrows';
import { logMessage } from '../../extension/commands/logMessage';

/**
 * Registers all extension commands and their handlers.
 *
 * This function iterates through a list of command definitions and registers each command
 * with the VS Code extension context. It handles two types of commands:
 *
 * 1. Commands that require the extension context: These commands are defined as functions
 *    that accept an `ExtensionContext` object as an argument.
 * 2. Commands that require a URI: These commands are defined as functions that accept a `Uri`
 *    object as an argument.
 *
 * For each command, the function constructs the full command identifier (e.g., "torn-focus-ui.showFolderIconAssignment")
 * and registers it with the appropriate handler function.
 *
 * @param context - The VS Code extension context.
 * @returns An array of `Disposable` objects representing the registered commands. These can be used to unregister the commands later if needed.
 */
export function registerCommands(context: ExtensionContext) {
    const registered: Disposable[] = [];

    ////////////////////////////////////////////////////////////////////
    ////  Commands
    ////////////////////////////////////////////////////////////////////

    //- Simple Commands (context) ------------------------------------
    const contextCommands: Record<string, (context: ExtensionContext) => Promise<void>> = {
        showFolderIconAssignment,
        toggleIcons,
        activateIconTheme,
        showAvailableIcons,
        toggleExplorerArrows,
    };

    //
    //- Simple Commands (context, uri) -------------------------------
    const uriCommands: Record<string, (context: ExtensionContext, uri: Uri) => Promise<void>> = {
        assignIcon,
        revertIcon,
        updateTerminalPath,
    };

    //
    //- Dotted Commands (context) ------------------------------------
    const prefixedContextCommands: Record<string, (context: ExtensionContext) => Promise<void>> = {
        'varLogger.logMessage': logMessage,
    };

    //
    //- Dotted Commands (context, uri) ------------------------------------
    const prefixedUriCommands: Record<string, (context: ExtensionContext, uri: Uri) => Promise<void>> = {
        'terminal.updateTerminalPath': updateTerminalPath,
    };

    //
    //
    //
    ////////////////////////////////////////////////////////////////////
    ////  Register Commands
    ////////////////////////////////////////////////////////////////////

    //- Context commands with no prefix ------------------------------
    for (const commandName in contextCommands) {
        registered.push(
            commands.registerCommand(`${constants.extension.name}.${commandName}`, () => {
                contextCommands[commandName](context);
            })
        );
    }

    //- Uri commands with no prefix ----------------------------------
    for (const commandName in uriCommands) {
        registered.push(
            commands.registerCommand(`${constants.extension.name}.${commandName}`, (uri: Uri) => {
                uriCommands[commandName](context, uri);
            })
        );
    }

    //- Register prefixed commands -----------------------------------
    for (const commandKey in prefixedContextCommands) {
        registered.push(
            commands.registerCommand(`${constants.extension.name}.${commandKey}`, () => {
                prefixedContextCommands[commandKey](context);
            })
        );
    }

    //- Register prefixed commands -----------------------------------
    for (const commandKey in prefixedUriCommands) {
        registered.push(
            commands.registerCommand(`${constants.extension.name}.${commandKey}`, (uri: Uri) => {
                prefixedUriCommands[commandKey](context, uri);
            })
        );
    }

    return registered;
}

//
//
//
//
//
//
//
//
//

// Is there a way by parsing the

// D:\_dev\torn-focus-ui\src\extension\commands\_commands.json

// to populate the contextCommands

// in the

// D:\_dev\torn-focus-ui\src\extension\helpers\registration.ts

//
//
//
// registered.push(
//     commands.registerCommand(`${constants.extension.name}.varLogger.logMessage`, async () => {
//         logMessage();
//     })
// );
//
//
//

////////////////////////////////////////////////////////////////////
////  Need a Uri
////////////////////////////////////////////////////////////////////

// registered.push(
//     commands.registerCommand(`${constants.extension.name}.updateTerminalPath`, async (uri: Uri) => {
//         updateTerminalPath(uri);
//     })
// );

// registered.push(
//     commands.registerCommand(`${constants.extension.name}.assignIcon`, async (uri: Uri) => {
//         assignIcon(context, uri);
//     })
// );

// registered.push(
//     commands.registerCommand(`${constants.extension.name}.revertIcon`, async (uri: Uri) => {
//         revertIcon(uri);
//     })
// );

// Use ExtensionContext
// const extensionCommands: Record<string, (context: ExtensionContext) => Promise<void>> = {
//     showFolderIconAssignment,
//     toggleIcons,
//     activateIconTheme,
//     showAvailableIcons,
//     toggleExplorerArrows,

// };
// for (const commandName in extensionCommands) {
//     registered.push(
//         commands.registerCommand(`${constants.extension.name}.${commandName}`, () => {
//             extensionCommands[commandName](context);
//         })
//     );
// }

// How to have the command list more like this

// 'showFolderIconAssignment',
// 'toggleIcons',
// 'activateIconTheme',
// 'showAvailableIcons',
// 'toggleExplorerArrows',
// 'varLogger.logMessage'

// instead of this

// 'showFolderIconAssignment': showFolderIconAssignment,
// 'toggleIcons': toggleIcons,
// 'activateIconTheme': activateIconTheme,
// 'showAvailableIcons': showAvailableIcons,
// 'toggleExplorerArrows': toggleExplorerArrows,
// 'varLogger.logMessage': logMessage,

// Is there a programatic way to convert this

// const extensionCommandNames: string[] = [
//     'showFolderIconAssignment',
//     'toggleIcons',
//     'activateIconTheme',
//     'showAvailableIcons',
//     'toggleExplorerArrows',
//     'varLogger.logMessage'
// ];

// to this

// // Map command names to their functions
// const commandFunctions: Record<string, (context: ExtensionContext) => Promise<void>> = {
//     'showFolderIconAssignment': showFolderIconAssignment,
//     'toggleIcons': toggleIcons,
//     'activateIconTheme': activateIconTheme,
//     'showAvailableIcons': showAvailableIcons,
//     'toggleExplorerArrows': toggleExplorerArrows,
//     'varLogger.logMessage': logMessage
// };

// const extensionCommandNames: string[] = [
//     'showFolderIconAssignment',
//     'toggleIcons',
//     'activateIconTheme',
//     'showAvailableIcons',
//     'toggleExplorerArrows',
//     'varLogger.logMessage'
// ];

// // Programmatically create the commandFunctions object
// const commandFunctions: Record<string, (context: ExtensionContext) => Promise<void>> = extensionCommandNames.reduce(
//     (acc, commandName) => {
//         // Assuming your functions are available in the current scope
//         acc[commandName] = eval(commandName);
//         return acc;
//     },
//     {} as Record<string, (context: ExtensionContext) => Promise<void>>
// );

// console.log(commandFunctions);
