// import { dirname, basename } from "path/posix";
// import { window, workspace, ConfigurationTarget, Uri, Terminal, ExtensionContext, commands } from "vscode";

// // import { Notify_HelloWorld, CopyFileName } from './commands';
// // import { basename, dirname, extname, join } from "path";
// // import { FileExplorerProvider } from './fileExplorerProvider';
// let lastTerminalDirectory: string | undefined;


// //- Set_IconTheme ------------------------------------------------>>


// async function Set_IconTheme() {
// 	const editor = window.activeTextEditor;

// 	if (!editor) {
// 		window.showErrorMessage('No active editor found.');
// 		return;
// 	}

// 	const currentTheme = workspace.getConfiguration('workbench');

// 	let currentThemeValue = currentTheme.get<string>('iconTheme');

// 	const newTheme = "torn_focus_icons";
// 	if (currentThemeValue !== newTheme) {
// 		await workspace.getConfiguration('workbench').update('iconTheme', newTheme, ConfigurationTarget.Global);
// 		window.showInformationMessage(`File icon theme updated to: ${newTheme}`);
// 	} else {
// 		window.showInformationMessage(`Your file icon theme is already ${newTheme}`);
// 	}
// }
// //----------------------------------------------------------------<<
// //- Get_ExplorerURI ---------------------------------------------->>


// async function Get_ExplorerURI(selectedItem?: any): Promise<Uri | undefined> {
// 	let newUri: Uri | undefined;

// 	if (!selectedItem) {
// 		// If called from the command palette, get the selected file/folder from the explorer
// 		const selectedItems = window.activeTextEditor?.selection;
// 		if (selectedItems) {
// 			newUri = window.activeTextEditor?.document.uri;
// 		} else {
// 			window.showErrorMessage('No active text editor found.');
// 			return undefined;
// 		}
// 	} else {
// 		// If called from the file explorer, use the provided selectedItem
// 		newUri = Uri.file(selectedItem);
// 	}

// 	return newUri;
// }
// //----------------------------------------------------------------<<
// //- Get_CDCommand ------------------------------------------------>>
// function Get_CDCommand(folder: string | undefined): string | undefined {
// 	const isWindows = (process.platform === "win32");

// 	// const activeTerminal = window.activeTerminal;
// 	const activeTerminal = window.activeTerminal;
// 	let command: string | undefined;

// 	if (activeTerminal) {
// 		const terminalName = activeTerminal.name;
// 		const terminalProcessId = activeTerminal.processId;

// 		if (isWindows) {
// 			if (terminalName.toLowerCase().includes('cmd')) {
// 				command = 'cd /d "' + folder + '"';
// 			} else if (terminalName.toLowerCase().includes('powershell')) {
// 				command = 'cd "' + folder + '"';
// 			} else {
// 				window.showInformationMessage(`Active terminal is not a PowerShell or Command Prompt. It's a ${terminalName} with process ID: ${terminalProcessId}`);
// 			}
// 		} else {
// 			window.showInformationMessage(`Not windows`);
// 		}
// 	}

// 	return command;
// }
// //----------------------------------------------------------------<<
// //- Get_CurrentFolder -------------------------------------------->>
// function Get_CurrentFolder(): string | undefined {
// 	const activeEditor = window.activeTextEditor;
// 	if (activeEditor) {
// 		const uri = activeEditor.document.uri;
// 		if (uri) {
// 			return dirname(uri.fsPath);
// 		}
// 	}
// 	return undefined;
// }
// //----------------------------------------------------------------<<
// //- getTargetTerminal -------------------------------------------->>
// function getTargetTerminal(targetTerminal: string | undefined): Terminal | undefined {
// 	if (targetTerminal === "Active") {
// 		return window.activeTerminal;
// 	} else if (targetTerminal === "First" && window.terminals.length > 0) {
// 		return window.terminals[0];
// 	}

// 	console.log('targetTerminal = ' + targetTerminal);

// 	return undefined;
// }
// //----------------------------------------------------------------<<
// function getEditorInfo(): { text?: string; tooltip?: string; color?: string; } | null {
// 	const editor = window.activeTextEditor;

// 	// If no workspace is opened or just a single folder, we return without any status label
// 	// because our extension only works when more than one folder is opened in a workspace.
// 	if (!editor || !workspace.workspaceFolders || workspace.workspaceFolders.length < 2) {
// 		return null;
// 	}

// 	let text: string | undefined;
// 	let tooltip: string | undefined;
// 	let color: string | undefined;

// 	// If we have a file:// resource we resolve the WorkspaceFolder this file is from and update
// 	// the status accordingly.
// 	const resource = editor.document.uri;
// 	if (resource.scheme === 'file') {
// 		const folder = workspace.getWorkspaceFolder(resource);
// 		if (!folder) {
// 			text = `$(alert) <outside workspace> → ${basename(resource.fsPath)}`;
// 		} else {
// 			text = `$(file-submodule) ${basename(folder.uri.fsPath)} (${folder.index + 1} of ${workspace.workspaceFolders.length}) → $(file-code) ${basename(resource.fsPath)}`;
// 			tooltip = resource.fsPath;

// 			const multiRootConfigForResource = workspace.getConfiguration('multiRootSample', resource);
// 			color = multiRootConfigForResource.get('statusColor');
// 		}
// 	}

// 	return { text, tooltip, color };
// }
// function syncTerminalDirectory(terminal: Terminal, targetFolder?: string) {

// 	const currentFolder = Get_CurrentFolder();










// 	console.log('Sync: currentFolder = ' + currentFolder);
// 	console.log('Sync: targetFolder = ' + targetFolder);
// 	console.log('Sync: lastTerminalDirectory = ' + lastTerminalDirectory);


// 	if ((targetFolder && lastTerminalDirectory) && (lastTerminalDirectory !== targetFolder)) {

// 		const command = Get_CDCommand(targetFolder);


// 		if (command) {

// 			console.log('');
// 			console.log('Load: Secondary = ' + command);

// 			terminal.sendText(command);
// 			lastTerminalDirectory = targetFolder; // Update lastTerminalDirectory
// 		}
// 	} else if (currentFolder && !lastTerminalDirectory) {
// 		// If no lastTerminalDirectory is set, sync on initial load
// 		const command = Get_CDCommand(currentFolder);



// 		if (command) {
// 			console.log('');
// 			console.log('Load: Initial = ' + command);
// 			terminal.sendText(command);
// 			lastTerminalDirectory = targetFolder; // Update lastTerminalDirectory
// 		}
// 	}



// }








// export function activate(context: ExtensionContext) {
// 	//console.log('Congratulations, your extension "torn-focus-ui" is now active!');
// 	//--- TerminalFollower ------------------------------------------------------------------------------>>
// 	const terminalChangeListener = window.onDidChangeActiveTerminal((activeTerminal) => {

// 		console.log('');
// 		console.log('Evnt: triggered = onDidChangeActiveTerminal ');

// 		if (activeTerminal) {
// 			lastTerminalDirectory = undefined;
// 			syncTerminalDirectory(activeTerminal);
// 		}
// 	});

// 	context.subscriptions.push(terminalChangeListener);



// 	const documentOpenListener = workspace.onDidOpenTextDocument((openedDocument) => {

// 		console.log('');
// 		console.log('Evnt: triggered = onDidOpenTextDocument');


// 		const currentConfig = workspace.getConfiguration();
// 		const dirWithFile = currentConfig.get<boolean>("torn-focus-ui.TerminalDirFollowsFile");
// 		const targetTerminal = currentConfig.get<string>("torn-focus-ui.TargetTerminal");

// 		const uri = openedDocument.uri;



// 		if (uri && dirWithFile) {

// 			const currentFolder = Get_CurrentFolder(); // Get the current folder based on the active file

// 			console.log('Main: currentFolder = ' + currentFolder);

// 			if (currentFolder) {
// 				const activeTerminal = getTargetTerminal(targetTerminal);

// 				console.log('Main: targetTerminal = ' + targetTerminal);

// 				if (activeTerminal) {
// 					syncTerminalDirectory(activeTerminal, currentFolder);
// 				}
// 			}
// 		}
// 	});

// 	context.subscriptions.push(documentOpenListener);


// 	//---------------------------------------------------------------------------------------------------<<
// 	//--- Notify_HelloWorld ----------------------------------------------------------------------------->>
// 	let Notify_HelloWorld = commands.registerCommand('torn-focus-ui.Notify_HelloWorld', async () => {

// 		window.showInformationMessage('Hello World from Torn Focus UI!');
// 	});

// 	context.subscriptions.push(Notify_HelloWorld);


// 	//---------------------------------------------------------------------------------------------------<<
// 	//--- Set_IconTheme --------------------------------------------------------------------------------->>
// 	let Set_IconTheme = commands.registerCommand('torn-focus-ui.Set_IconTheme', async () => {

// 		const editor = window.activeTextEditor;
// 		if (!editor) {
// 			window.showErrorMessage('No active editor found.');
// 			return;
// 		}

// 		const currentTheme = workspace.getConfiguration('workbench');
// 		let currentThemeValue = currentTheme.get<string>('iconTheme');

// 		const newTheme = "torn_focus_icons";

// 		if (currentThemeValue !== newTheme) {
// 			await workspace.getConfiguration('workbench').update('iconTheme', newTheme, ConfigurationTarget.Global);
// 			window.showInformationMessage(`File icon theme updated to: ${newTheme}`);
// 		} else {
// 			window.showInformationMessage(`Your file icon theme is already ${newTheme}`);
// 		}
// 	});

// 	context.subscriptions.push(Set_IconTheme);


// 	//---------------------------------------------------------------------------------------------------<<
// 	//--- LogSelectedName ------------------------------------------------------------------------------->>
// 	let LogSelectedName = commands.registerCommand('torn-focus-ui.LogSelectedName', async () => {
// 		const selectedItem = window.activeTextEditor?.selection;

// 		if (selectedItem) {
// 			const selectedUri = window.activeTextEditor?.document.uri;

// 			if (selectedUri) {
// 				const selectedFilePath = selectedUri.fsPath;
// 				console.log(`Selected File Path: ${selectedFilePath}`);
// 			} else {
// 				window.showErrorMessage('No selected file found.');
// 			}

// 		} else {
// 			window.showErrorMessage('No selected file found.');
// 		}
// 	});

// 	context.subscriptions.push(LogSelectedName);


// 	//---------------------------------------------------------------------------------------------------<<
// 	//--- LogFocusedName -------------------------------------------------------------------------------->>
// 	let LogFocusedName = commands.registerCommand('torn-focus-ui.LogFocusedName', async (fileUri) => {
// 		console.log(fileUri);
// 	});

// 	context.subscriptions.push(LogFocusedName);


// 	//---------------------------------------------------------------------------------------------------<<
// }


// export function deactivate() { }
