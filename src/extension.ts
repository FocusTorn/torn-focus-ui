/** @format */
import { Position, window, ExtensionContext, workspace, commands} from 'vscode';

import { updateIconThemeNoWorkspace, updateHidesExplorerArrows } from './helpers/updateIconTheme';

import { registerCommands } from './extension/helpers/registration';
import { getThemeConfig } from './config/configurationActions';
import { generateLogMessage, getMsgTargetLine } from './extension/helpers/log-message';


// function _lwkejfwef(){
    
//     const zxc = 'asdasd';
//     console.log(zxc);

//     // Inside Array, followed by CLog
//     const qwe  = [ 1, 2, 3];
//     console.log(qwe);


//     // Inside Array, followed by other
//     const _myArray2 = [ 1, 2, 3];
//     const _notherVar = 177;
//     console.log(_myArray2[0]);

//     const myArray3 = [
//         1,
//         2,
//         3
//     ];
//     console.log(myArray3[0]);

//     const name = "John";
//     const greeting = `Hello, ${name}!`;
//     console.log(greeting);

//     class MyClass {
//       myFunction() {
//         const _myVar = 42;
//       }
//     }

//     const _asd = new MyClass();
    
// }








export function activate(context: ExtensionContext) {

    context.subscriptions.push(...registerCommands(context));

    //--- onDidChangeConfiguration ---------------------------------------------------------------------->>

    context.subscriptions.push(
        workspace.onDidChangeConfiguration((e) => {

            if (e.affectsConfiguration('TornFocusUi.themes.hidesExplorerArrows')) {
                const hidesExplorerArrows: boolean = getThemeConfig().get('themes.hidesExplorerArrows') ?? true;
                updateHidesExplorerArrows(hidesExplorerArrows);
            }

            //- updateIconThemeNoWorkspace ---------------
            if (e.affectsConfiguration('TornFocusUi.themes.customIcons')) {
                updateIconThemeNoWorkspace(context);
            }
        })
    );

    //---------------------------------------------------------------------------------------------------<<











    context.subscriptions.push(
        commands.registerCommand(
            "torn-focus-ui.debug.logMessage",
            async () => {

                const editor = window.activeTextEditor;
                if (!editor) { console.log("[MAIN: logMessage] No active editor found."); return; }
                
                const document = editor.document;
                console.log(`[MAIN: logMessage] Number of selections: ${editor.selections.length}`);

                
                for (const element of editor.selections) {
                    const selection = element;
                    const selectedVar = document.getText(selection);
                    
                    // zero based line number
                    const lineOfSelectedVar = selection.active.line;



                    // Log selected variable and line
                    console.log(`[MAIN: logMessage] Selected variable: ${selectedVar}, Line: ${lineOfSelectedVar} (actual: ${lineOfSelectedVar+1})`);

                    if (selectedVar.trim().length !== 0) {
                        await editor.edit(editBuilder => {
                            const logMessageLine = getMsgTargetLine(
                                document,
                                lineOfSelectedVar,
                                selectedVar
                            );



                            // Log the calculated line
                            console.log(`[MAIN: logMessage] Calculated log message line: ${logMessageLine} (actual: ${logMessageLine+1})`);

                            const logMessageContent = generateLogMessage({
                                document: document,
                                selectedVar: selectedVar,
                                lineOfSelectedVar: lineOfSelectedVar,
                                insertEnclosingClass: true,
                                insertEnclosingFunction: true
                            });



                            // Log the generated message
                            console.log(`[MAIN: logMessage] Generated log message: ${logMessageContent}`);

                            editBuilder.insert(
                                new Position(
                                    logMessageLine >= document.lineCount
                                        ? document.lineCount
                                        : logMessageLine,
                                    0
                                ),

                                logMessageContent
                            );
                        });


                    } else {

                        // Log if selection is empty
                        console.log("[MAIN: logMessage] Skipping empty selection.");
                    }
                }
            }
        )
    );


































    context.subscriptions.push(
        commands.registerCommand(
            'torn-focus-ui.wip',
            async () => {







            }));





    // const activeEditor = window.activeTextEditor;
    // if (activeEditor) {
    //     const activeWorkspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
    //     console.log(activeWorkspaceFolder);
    // }


    // let sel = Get_ExplorerSelectedURI();
    // let mr = Get_MultiRootEditorInfo();
    // console.log(mr);



    // //- Get workspace root folder ----------------------------------------------------------------
    // const workspaceFolders = vscode.workspace.workspaceFolders;
    // if (workspaceFolders && workspaceFolders.length > 0) {
    //     // Get the URI of the first workspace folder
    //     const workspaceFolderUri = workspaceFolders[0].uri;

    //     // Check if it's a file URI (indicating a workspace file)
    //     if (workspaceFolderUri.scheme === 'file') {
    //         // Get the workspace file path
    //         const workspaceFilePath = workspaceFolderUri.fsPath;

    //         // Extract the workspace name from the file path
    //         const workspaceName = path.basename(workspaceFilePath, '.code-workspace');

    //         console.log(`Workspace Name: ${workspaceName}`);
    //         // You can also display it in a message box
    //         vscode.window.showInformationMessage(`Workspace Name: ${workspaceName}`);
    //     } else {
    //         console.log('Not a workspace file.');
    //     }
    // } else {
    //     console.log('No workspace open.');
    // }










    // commands.registerCommand(
    //     "TornFocusUi.debug.logMessage",
    //     async () => {

    //         const editor = window.activeTextEditor;
    //         if (!editor) { return; }

    //         const document = editor.document;
    //         // const config = workspace.getConfiguration("TornFocusUi");

    //         for (const element of editor.selections) {
    //             const selection = element;
    //             const selectedVar = document.getText(selection);
    //             const lineOfSelectedVar = selection.active.line;

    //             if (selectedVar.trim().length !== 0) {
    //                 await editor.edit(editBuilder => {
    //                     const logMessageLine = getMsgTargetLine(
    //                         document,
    //                         lineOfSelectedVar,
    //                         selectedVar
    //                     );

    //                     // Get the log message (including enclosing class/function logic)
    //                     const logMessageContent = generateLogMessage({
    //                         document: document,
    //                         selectedVar: selectedVar,
    //                         lineOfSelectedVar: lineOfSelectedVar,
    //                         insertEnclosingClass: true,
    //                         insertEnclosingFunction: true
    //                     });

    //                     editBuilder.insert(
    //                         new Position(
    //                             logMessageLine >= document.lineCount
    //                                 ? document.lineCount
    //                                 : logMessageLine,
    //                             0
    //                         ),
    //                         logMessageContent
    //                     );
    //                 });
    //             }
    //         }
    //     }
    // );























































































    //--- LogSelectedName

    // let LogSelectedName = commands.registerCommand('torn-focus-ui.LogSelectedName', async () => {
    //     const selectedItem = window.activeTextEditor?.selection;

    //     if (selectedItem) {
    //         const selectedUri = window.activeTextEditor?.document.uri;

    //         if (selectedUri) {
    //             const selectedFilePath = selectedUri.fsPath;
    //             console.log(`Selected File Path: ${selectedFilePath}`);
    //         } else {
    //             window.showErrorMessage('No selected file found.');
    //         }
    //     } else {
    //         window.showErrorMessage('No selected file found.');
    //     }
    // });

    // context.subscriptions.push(LogSelectedName);




    //--- LogFocusedName

    // let LogFocusedName = commands.registerCommand('torn-focus-ui.LogFocusedName', async (fileUri) => {
    //     console.log(fileUri);
    // });
    // context.subscriptions.push(LogFocusedName);

    // context.subscriptions.push(commands.registerCommand('torn-focus-ui.LogFocusedName',
    //     async (fileUri) => {
    //         console.log(fileUri);
    //     }

    // ));
















}


export function deactivate() { /* There is nothing to deactivate */ }



