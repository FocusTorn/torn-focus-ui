/** @format */

import { ExtensionContext, workspace, commands,} from 'vscode';

import { updateIconThemeNoWorkspace, updateHidesExplorerArrows } from './helpers/updateIconTheme';

import { registerCommands } from './extension/helpers/registration';
import{ getThemeConfig } from './config/configurationActions';





export function activate(context: ExtensionContext) {

    context.subscriptions.push(...registerCommands(context));

    //--- onDidChangeConfiguration ---------------------------------------------------------------------->>
    // We tryEt again

    context.subscriptions.push(
        workspace.onDidChangeConfiguration((e) => {




            if (e.affectsConfiguration('TornFocusUi.themes.hidesExplorerArrows')) {

                const hidesExplorerArrows:boolean = getThemeConfig().get('themes.hidesExplorerArrows') ?? true;
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


// export function deactivate() { }



