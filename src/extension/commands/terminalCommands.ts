
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

import { window } from 'vscode';






export const updateTerminalPath = (fileUri: vscode.Uri) => {
    return updateTerminalPath_fn(fileUri);
};

const updateTerminalPath_fn = async (fileUri: vscode.Uri) => {
    try {

        const terminal = window.activeTerminal;
        if (terminal) {
            const targetPath = fs.statSync(fileUri.fsPath).isDirectory()
                ? fileUri.fsPath
                : path.dirname(fileUri.fsPath);

            // Use Get_CDCommand to get the correct command
            const cdCommand = Get_CDCommand(targetPath);

            if (cdCommand) {
                terminal.sendText(cdCommand);
            } else {
                // Handle the case where Get_CDCommand returns undefined
                // (e.g., unsupported terminal type)
                window.showErrorMessage('Could not determine the cd command for the active terminal.');
            }
        } else {
            window.showErrorMessage('No active terminal found.');
        }

    } catch (error) {
        console.error(error);
        window.showErrorMessage('An error occurred while activating the icon theme.');
    }


};





function Get_CDCommand(folder: string | undefined): string | undefined {
    const isWindows = process.platform === 'win32';

    const activeTerminal = window.activeTerminal;
    let command: string | undefined;

    if (activeTerminal) {
        const terminalName = activeTerminal.name;
        // const terminalProcessId = activeTerminal.processId;

        if (isWindows) {
            if (terminalName.toLowerCase().includes('cmd')) {
                command = 'cd /d "' + folder + '"';
            } else if (terminalName.toLowerCase().includes('powershell')) {
                command = `Set-Location '${folder}'`;
            } else {
                // For other terminals on Windows (bash, zsh, etc.), assume 'cd' works
                command = `cd "${folder}"`;
            }
        } else {
            // On non-Windows platforms, 'cd' is the standard
            command = `cd "${folder}"`;
        }
    }

    return command;
}



// function updateTerminalDirectory() {

//     const activeTerminal = window.activeTerminal;

//     if (activeTerminal) {

//         const activeEditor = window.activeTextEditor;

//         if (activeEditor) {

//             const currentFolder = path.dirname(activeEditor.document.uri.fsPath);

//             const cdCommand = process.platform === 'win32' ? `cd /d "${currentFolder}"` : `cd ${currentFolder}`;

//             activeTerminal.sendText(cdCommand);

//         }

//     }
// }




                // context.subscriptions.push(commands.registerCommand('torn-focus-ui.openInCurrentTerminal',
                //     async (fileUri: Uri) => {
                //         const terminal = window.activeTerminal;
                //         if (terminal) {
                //             const targetPath = fs.statSync(fileUri.fsPath).isDirectory()
                //                 ? fileUri.fsPath
                //                 : path.dirname(fileUri.fsPath);

                //             // Use Get_CDCommand to get the correct command
                //             const cdCommand = Get_CDCommand(targetPath);

                //             if (cdCommand) {
                //                 terminal.sendText(cdCommand);
                //             } else {
                //                 // Handle the case where Get_CDCommand returns undefined
                //                 // (e.g., unsupported terminal type)
                //                 window.showErrorMessage('Could not determine the cd command for the active terminal.');
                //             }
                //         } else {
                //             window.showErrorMessage('No active terminal found.');
                //         }
                //     }
                // ));
