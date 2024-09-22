// fileExplorerProvider.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
// import * as path from 'path';

// File Explorer Item
interface FileExplorerItem {
    label: string;
    children?: FileExplorerItem[];
}

// File Explorer Provider
export class FileExplorerProvider implements vscode.TreeDataProvider<FileExplorerItem> {
    getTreeItem(element: FileExplorerItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return {
            label: element.label,
            collapsibleState: element.children ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
            command: {
                command: 'torn-focus-ui.copyFileName',
                title: 'Copy File Name',
                arguments: [element.label]
            }
        };
    }

    getChildren(element?: FileExplorerItem): vscode.ProviderResult<FileExplorerItem[]> {
        if (!element) {
            return this.getWorkspaceFolders();
        }
        return element.children;
    }

    private getWorkspaceFolders(): FileExplorerItem[] {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            return workspaceFolders.map(folder => ({
                label: folder.name,
                children: this.getFilesInFolder(folder.uri.fsPath)
            }));
        }
        return [];
    }

    private getFilesInFolder(folderPath: string): FileExplorerItem[] {
        const files = fs.readdirSync(folderPath);
        return files.map(file => ({
            label: file,
            children: []
        }));
    }
}
