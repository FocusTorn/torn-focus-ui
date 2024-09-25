import { Position, window, TextDocument} from 'vscode';
import ts from 'typescript';
import { getThemeConfig } from '../../config/configurationActions';

// Helper object to hold shared data and methods
class LogMessageHelper {
    document: TextDocument;
    sourceFile: ts.SourceFile;

    constructor(document: TextDocument) {
        this.document = document;
        const sourceCode = document.getText();
        this.sourceFile = ts.createSourceFile(document.fileName, sourceCode, ts.ScriptTarget.Latest, true);
    }

    getMsgTargetLine(selectionLine: number, selectedVar: string): number {
        const selectedNode = this.findNodeAtLine(selectionLine, selectedVar);
        if (!selectedNode) {
            return selectionLine;
        }
        return this.determineTargetLine(selectedNode);
    }

    generateLogMessage(selectedVar: string, lineOfSelectedVar: number): string {
        const config = getThemeConfig();
        const includeClassName = config.get('varLogger.includeClassName') ?? true;
        const includeFunctionName = config.get('varLogger.includeFunctionName') ?? true;

        const className = includeClassName ? this.getEnclosingClassName(lineOfSelectedVar) : '';
        const funcName = includeFunctionName ? this.getEnclosingFunctionName(lineOfSelectedVar) : '';

        const lineOfLogMsg = this.getMsgTargetLine(lineOfSelectedVar, selectedVar);
        const spacesBeforeMsg = this.calculateSpaces(lineOfSelectedVar);

        const debuggingMsg = `${spacesBeforeMsg}console.log('${className}${funcName}${selectedVar}:', ${selectedVar});`;

        return `${lineOfLogMsg === this.document.lineCount ? '\n' : ''}${debuggingMsg}\n`;
    }


    private findNodeAtLine(line: number, varName: string): ts.Node | undefined {
        let foundNode: ts.Node | undefined;

        const traverse = (node: ts.Node) => {
            const nodeStartLine = this.sourceFile.getLineAndCharacterOfPosition(node.getStart()).line;
            const nodeEndLine = this.sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;

            if (nodeStartLine <= line && nodeEndLine >= line && node.getText().includes(varName)) {
                // Prioritize VariableDeclaration nodes
                if (node.kind === ts.SyntaxKind.VariableDeclaration && (node as ts.VariableDeclaration).name.getText() === varName) {
                    foundNode = node;
                    return;
                } else if (!foundNode) { 
                    // Only consider other node types if no VariableDeclaration is found
                    foundNode = node;
                }
            }
            ts.forEachChild(node, traverse);
        };

        traverse(this.sourceFile);
        return foundNode;
    }


    private determineTargetLine(node: ts.Node): number {
        let targetLine = this.sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
        let parent = node.parent;
        let templateLiteralDepth = 0;

        while (parent) {
            switch (parent.kind) {
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.ArrowFunction:
                case ts.SyntaxKind.FunctionExpression:
                    targetLine = this.findNextStatementLine(node, parent);
                    break;
                case ts.SyntaxKind.ArrayLiteralExpression:
                case ts.SyntaxKind.ObjectLiteralExpression:
                case ts.SyntaxKind.CallExpression:
                    targetLine = this.sourceFile.getLineAndCharacterOfPosition(parent.getEnd()).line + 1;
                    break;
                case ts.SyntaxKind.TemplateExpression:
                    templateLiteralDepth++;
                    break;
            }

            parent = parent.parent;

            if (parent && parent.kind === ts.SyntaxKind.TemplateExpression) {
                templateLiteralDepth--;
            }

            if (templateLiteralDepth === 0 && parent && parent.kind !== ts.SyntaxKind.TemplateExpression) {
                targetLine = this.sourceFile.getLineAndCharacterOfPosition(parent.getEnd()).line + 1;
                break;
            }
        }
        return targetLine;
    }

    private findNextStatementLine(node: ts.Node, functionNode: ts.Node): number {
        const nodeEndPos = node.getEnd();

        if ((ts.isFunctionDeclaration(functionNode) || ts.isArrowFunction(functionNode)) && functionNode.body && ts.isBlock(functionNode.body)) {
            let targetLine = this.sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
            for (const statement of functionNode.body.statements) {
                if (statement.getStart() > nodeEndPos) {
                    targetLine = this.sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line;
                    break;
                }
            }
            return targetLine;
        }

        return this.sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
    }

    private calculateSpaces(line: number): string {
        const currentLine = this.document.lineAt(line);
        const firstNonWhitespaceIndex = currentLine.firstNonWhitespaceCharacterIndex;
        return ' '.repeat(firstNonWhitespaceIndex);
    }

    private getEnclosingClassName(lineOfSelectedVar: number): string {
        const classDeclarationRegex = /class\s+([a-zA-Z]+)\s*(.*)\s*{/;

        for (let currentLineNum = lineOfSelectedVar; currentLineNum >= 0; currentLineNum--) {
            const currentLineText = this.document.lineAt(currentLineNum).text;

            const match = classDeclarationRegex.exec(currentLineText);
            if (match) {
                const closingBraceLine = this.getClosingLine(currentLineNum);

                if (lineOfSelectedVar >= currentLineNum && lineOfSelectedVar < closingBraceLine) {
                    return `${match[1].trim()} -> `;
                }
            }
        }
        return '';
    }

    private getEnclosingFunctionName(lineOfSelectedVar: number): string {
        const namedFunctionDeclarationRegex = /([a-zA-Z]+)\s*\(.*\)\s*{/;
        const namedFunctionExpressionRegex = /([a-zA-Z]+)\s*=\s*(function)?\s*[a-zA-Z]*\s*\(.*\)\s*(=>)?\s*{/;
        const jsBuiltInStatementRegex = /(if|switch|while|for|catch)\s*\(.*\)\s*{/;

        for (let currentLineNum = lineOfSelectedVar; currentLineNum >= 0; currentLineNum--) {
            const currentLineText = this.document.lineAt(currentLineNum).text;

            if (!jsBuiltInStatementRegex.test(currentLineText)) {
                let match = namedFunctionDeclarationRegex.exec(currentLineText);
                if (!match) {
                    match = namedFunctionExpressionRegex.exec(currentLineText);
                }

                if (match) {
                    const closingBraceLine = this.getClosingLine(currentLineNum);

                    if (lineOfSelectedVar >= currentLineNum && lineOfSelectedVar < closingBraceLine) {
                        return `${match[1].trim()} -> `;
                    }
                }
            }
        }
        return '';
    }

    private getClosingLine(startingLine: number): number {
        let openBrackets = 1;
        let closeBrackets = 0;
        let currentLineNum = startingLine + 1;

        while (currentLineNum < this.document.lineCount) {
            const currentLineText = this.document.lineAt(currentLineNum).text;
            openBrackets += (currentLineText.match(/{/g) || []).length;
            closeBrackets += (currentLineText.match(/}/g) || []).length;

            if (openBrackets === closeBrackets) {
                return currentLineNum;
            }
            currentLineNum++;
        }

        return this.document.lineCount;
    }
}







export const logMessage =  async () => {
    
    console.log("Wascalled");
    
    
    const editor = window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const helper = new LogMessageHelper(document);

    for (const selection of editor.selections) {
        const selectedVar = document.getText(selection);
        const lineOfSelectedVar = selection.active.line;

        if (selectedVar.trim() !== '') {
            await editor.edit((editBuilder) => {
                const logMessageLine = helper.getMsgTargetLine(lineOfSelectedVar, selectedVar);
                const logMessageContent = helper.generateLogMessage(selectedVar, lineOfSelectedVar);

                editBuilder.insert(
                    new Position(logMessageLine >= document.lineCount ? document.lineCount : logMessageLine, 0),
                    logMessageContent
                );
            });
        }
    }
};











// NEED TO REFACTOR




// // torn-focus-ui.debug.logMessage - context: ExtensionContext, fileUri: Uri
// const logMessage = async () => {
//     const editor = window.activeTextEditor;
//     if (!editor) {
//         return;
//     }

//     const document = editor.document;

//     for (const selection of editor.selections) {
//         const selectedVar = document.getText(selection);
//         const lineOfSelectedVar = selection.active.line;

//         if (selectedVar.trim() !== '') {
//             await editor.edit((editBuilder) => {
//                 const logMessageLine = getMsgTargetLine(document, lineOfSelectedVar, selectedVar);

//                 const logMessageContent = generateLogMessage({
//                     document,
//                     selectedVar,
//                     lineOfSelectedVar,
//                     insertEnclosingClass: true,
//                     insertEnclosingFunction: true,
//                 });

//                 editBuilder.insert(
//                     new Position(logMessageLine >= document.lineCount ? document.lineCount : logMessageLine, 0),
//                     logMessageContent
//                 );
//             });
//         }
//     }
// };




// //>  START: getMsgTargetLine 

// /**
//  * Determines the target line number for inserting a log message based on the selected variable and code structure.
//  *
//  * This function analyzes the code to find the appropriate line to insert a `console.log` statement
//  * for the given variable. It considers factors like:
//  *
//  * - Enclosing functions: The log message will be placed inside the nearest function containing the variable.
//  * - Arrays and objects: If the variable is declared inside an array or object literal, the log message
//  *   will be placed after the declaration.
//  * - Template literals: The logic handles variables declared within template literals.
//  *
//  * @param document The VS Code TextDocument representing the current code file.
//  * @param selectionLine The line number where the variable is selected (zero-based).
//  * @param selectedVar The name of the variable being logged.
//  *
//  * @returns The zero-based line number where the log message should be inserted.
//  */
// function getMsgTargetLine(document: TextDocument, selectionLine: number, selectedVar: string): number {
//     //--- Parse into an AST ------------------------------------------
//     const sourceCode = document.getText();
//     const sourceFile = ts.createSourceFile(document.fileName, sourceCode, ts.ScriptTarget.Latest, true);

//     //--- Find selectedVar's node  -----------------------------------
//     const selectedNode = findNodeAtLine(sourceFile, selectionLine, selectedVar);
//     if (!selectedNode) {
//         // Default if node not found
//         return selectionLine;
//     }

//     return determineTargetLine(sourceFile, selectedNode);
// }

// /**
//  * Finds the TypeScript AST node at a specific line that contains a given variable name.
//  *
//  * This function traverses the Abstract Syntax Tree (AST) of a TypeScript source file
//  * to locate a node that:
//  * 1. Spans the target line number.
//  * 2. Contains the specified variable name within its text.
//  *
//  * It prioritizes finding variable declarations (`VariableDeclaration` nodes) that match
//  * the variable name exactly. If no exact match is found, it may return other node types
//  * that contain the variable name (e.g., `PropertyAccessExpression`).
//  *
//  * @param sourceFile The TypeScript `SourceFile` representing the code.
//  * @param line The zero-based line number to search on.
//  * @param varName The name of the variable to find.
//  *
//  * @returns The `ts.Node` found at the specified line containing the variable name,
//  *          or `undefined` if no matching node is found.
//  */
// function findNodeAtLine(sourceFile: ts.SourceFile, line: number, varName: string): ts.Node | undefined {
//     let foundNode: ts.Node | undefined;

//     /**
//      * Recursively traverses the AST to find a node that spans the target line
//      * and contains the variable name.
//      *
//      * @param node The current AST node being visited.
//      */
//     function traverse(node: ts.Node): void {
//         // Check if the node's position encompasses the target line
//         const nodeStartLine = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line;
//         const nodeEndLine = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;

//         if (nodeStartLine <= line && nodeEndLine >= line) {
//             // Check if the node's text contains the variable name
//             if (node.getText().includes(varName)) {
//                 // More specific check for variable declarations:
//                 if (
//                     node.kind === ts.SyntaxKind.VariableDeclaration &&
//                     (node as ts.VariableDeclaration).name.getText() === varName
//                 ) {
//                     foundNode = node;
//                     // Stop traversal if exact match found
//                     return;
//                 } else {
//                     // Consider other node types (e.g., PropertyAccessExpression)
//                     // ... (Add logic based on your needs)
//                     foundNode = node;
//                 }
//             }
//             // Continue traversal for nested nodes
//             ts.forEachChild(node, traverse);
//         }
//     }
//     traverse(sourceFile);
//     return foundNode;
// }

// /**
//  * Determines the appropriate line number to insert the log message, considering enclosing structures.
//  *
//  * This function traverses up the AST from the given node, looking for specific parent node types
//  * (functions, arrays, objects, template literals) to determine the correct line for insertion.
//  *
//  * @param sourceFile The TypeScript `SourceFile` representing the code.
//  * @param node The AST node representing the selected variable.
//  *
//  * @returns The zero-based line number where the log message should be inserted.
//  */
// function determineTargetLine(sourceFile: ts.SourceFile, node: ts.Node): number {
//     let targetLine = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
//     let parent = node.parent;
//     let templateLiteralDepth = 0;

//     while (parent) {
//         switch (parent.kind) {
//             case ts.SyntaxKind.FunctionDeclaration:
//             case ts.SyntaxKind.ArrowFunction:
//             case ts.SyntaxKind.FunctionExpression:
//                 targetLine = findNextStatementLine(sourceFile, node, parent);
//                 break;

//             case ts.SyntaxKind.ArrayLiteralExpression:
//             case ts.SyntaxKind.ObjectLiteralExpression:
//             case ts.SyntaxKind.CallExpression:
//                 targetLine = sourceFile.getLineAndCharacterOfPosition(parent.getEnd()).line + 1;
//                 break;

//             case ts.SyntaxKind.TemplateExpression:
//                 templateLiteralDepth++;
//                 break;
//         }

//         // Move to the next parent in the AST
//         parent = parent.parent;

//         // Decrement depth if exiting a TemplateExpression
//         if (parent && parent.kind === ts.SyntaxKind.TemplateExpression) {
//             templateLiteralDepth--;
//         }

//         // If we were inside a template literal, and we've moved past it, stop
//         if (templateLiteralDepth === 0 && parent && parent.kind !== ts.SyntaxKind.TemplateExpression) {
//             targetLine = sourceFile.getLineAndCharacterOfPosition(parent.getEnd()).line + 1;
//             break;
//         }
//     }
//     return targetLine;
// }

// /**
//  * Finds the line number of the next statement within a function's body, after the given node.
//  *
//  * This function is used to determine where to insert a log message within a function,
//  * ensuring it's placed after the selected variable declaration or expression.
//  *
//  * @param sourceFile The TypeScript `SourceFile` representing the code.
//  * @param node The AST node representing the selected variable.
//  * @param functionNode The AST node representing the enclosing function.
//  *
//  * @returns The zero-based line number of the next statement, or the end line of the node
//  *          if no next statement is found or if the `functionNode` is not a function-like node.
//  */
// function findNextStatementLine(sourceFile: ts.SourceFile, node: ts.Node, functionNode: ts.Node): number {
//     // 1. Get the position of the selected node
//     const nodeEndPos = node.getEnd();

//     // 2. Check if the functionNode actually has statements
//     // Check if it's a function-like node
//     // Check for a 'body' property with a 'block' type
//     if (ts.isFunctionDeclaration(functionNode) || ts.isArrowFunction(functionNode)) {
//         if (functionNode.body && ts.isBlock(functionNode.body)) {
//             // 3. Iterate through the function body's statements
//             let targetLine = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
//             for (const statement of functionNode.body.statements) {
//                 if (statement.getStart() > nodeEndPos) {
//                     targetLine = sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line;
//                     break;
//                 }
//             }
//             return targetLine;
//         }

//         return sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
//     } else {
//         // Handle cases where functionNode doesn't have statements
//         // You might want to log an error or handle it differently based on your needs
//         console.error('Node does not have statements property:', functionNode.kind);
//         // Default to the end of the node
//         return sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
//     }
// }

// //<  END: getMsgTargetLine 

// //>  START: generateLogMessage 

// /**
//  * Generates a log message string with optional class and function name prefixes.
//  *
//  * This function constructs a `console.log` statement for the given variable,
//  * optionally including the enclosing class and function names to provide context.
//  *
//  * @param options An object containing the following options:
//  *   - document: The VS Code TextDocument representing the current code file.
//  *   - selectedVar: The name of the variable being logged.
//  *   - lineOfSelectedVar: The line number where the variable is selected.
//  *   - insertEnclosingClass: Whether to include the enclosing class name.
//  *   - insertEnclosingFunction: Whether to include the enclosing function name.
//  *
//  * @returns The formatted log message string.
//  */
// function generateLogMessage(options: LogMessageOptions): string {
//     const { document, selectedVar, lineOfSelectedVar } = options;

//     const config = getThemeConfig();
//     const includeClassName = config.get('varLogger.includeClassName') ?? true;
//     const includeFunctionName = config.get('varLogger.includeFunctionName') ?? true;

//     // Use configuration to determine whether to include class/function names
//     const className = includeClassName ? getEnclosingClassName(document, lineOfSelectedVar) : '';
//     const funcName = includeFunctionName ? getEnclosingFunctionName(document, lineOfSelectedVar) : '';

//     // const className = insertEnclosingClass ? getEnclosingClassName(document, lineOfSelectedVar) : '';
//     // const funcName = insertEnclosingFunction ? getEnclosingFunctionName(document, lineOfSelectedVar) : '';

//     const lineOfLogMsg = getMsgTargetLine(document, lineOfSelectedVar, selectedVar);
//     const spacesBeforeMsg = calculateSpaces(document, lineOfSelectedVar);

//     const debuggingMsg = `${spacesBeforeMsg}console.log('${className}${funcName}${selectedVar}:', ${selectedVar});`;

//     return `${lineOfLogMsg === document.lineCount ? '\n' : ''}${debuggingMsg}\n`;
// }

// /**
//  * Calculates the number of spaces used for indentation at the beginning of a given line.
//  *
//  * This function determines the indentation level of a line by counting the number of spaces
//  * before the first non-whitespace character.
//  *
//  * @param document The VS Code TextDocument representing the current code file.
//  * @param line The zero-based line number for which to calculate the indentation.
//  *
//  * @returns A string containing the indentation spaces.
//  */

// function calculateSpaces(document: TextDocument, line: number): string {
//     const currentLine = document.lineAt(line);
//     const firstNonWhitespaceIndex = currentLine.firstNonWhitespaceCharacterIndex;
//     return ' '.repeat(firstNonWhitespaceIndex);
// }

// /**
//  * Finds the name of the enclosing class for a variable at a given line number.
//  *
//  * This function searches backwards from the given line number to find the nearest
//  * enclosing class declaration. It returns the class name with " -> " appended
//  * if found, otherwise an empty string.
//  *
//  * @param document The VS Code TextDocument representing the current code file.
//  * @param lineOfSelectedVar The line number where the variable is selected.
//  *
//  * @returns The name of the enclosing class with " -> " appended, or an empty string if not found.
//  */
// function getEnclosingClassName(document: TextDocument, lineOfSelectedVar: number): string {
//     const classDeclarationRegex = /class\s+([a-zA-Z]+)\s*(.*)\s*{/;

//     for (let currentLineNum = lineOfSelectedVar; currentLineNum >= 0; currentLineNum--) {
//         const currentLineText = document.lineAt(currentLineNum).text;

//         const match = classDeclarationRegex.exec(currentLineText);
//         if (match) {
//             const closingBraceLine = getClosingLine(document, currentLineNum);

//             if (lineOfSelectedVar >= currentLineNum && lineOfSelectedVar < closingBraceLine) {
//                 return `${match[1].trim()} -> `;
//             }
//         }
//     }
//     return '';
// }

// /**
//  * Finds the name of the enclosing function for a variable at a given line number.
//  *
//  * This function searches backwards from the given line number to find the nearest
//  * enclosing named function declaration or expression (excluding built-in statements).
//  * It returns the function name with " -> " appended if found, otherwise an empty string.
//  *
//  * @param document The VS Code TextDocument representing the current code file.
//  * @param lineOfSelectedVar The line number where the variable is selected.
//  *
//  * @returns The name of the enclosing function with " -> " appended, or an empty string if not found.
//  */
// function getEnclosingFunctionName(document: TextDocument, lineOfSelectedVar: number): string {
//     const namedFunctionDeclarationRegex = /([a-zA-Z]+)\s*\(.*\)\s*{/;
//     const namedFunctionExpressionRegex = /([a-zA-Z]+)\s*=\s*(function)?\s*[a-zA-Z]*\s*\(.*\)\s*(=>)?\s*{/;
//     const jsBuiltInStatementRegex = /(if|switch|while|for|catch)\s*\(.*\)\s*{/;

//     for (let currentLineNum = lineOfSelectedVar; currentLineNum >= 0; currentLineNum--) {
//         const currentLineText = document.lineAt(currentLineNum).text;

//         if (!jsBuiltInStatementRegex.test(currentLineText)) {
//             let match = namedFunctionDeclarationRegex.exec(currentLineText);
//             if (!match) {
//                 match = namedFunctionExpressionRegex.exec(currentLineText);
//             }

//             if (match) {
//                 const closingBraceLine = getClosingLine(document, currentLineNum);

//                 if (lineOfSelectedVar >= currentLineNum && lineOfSelectedVar < closingBraceLine) {
//                     return `${match[1].trim()} -> `;
//                 }
//             }
//         }
//     }
//     return '';
// }

// /**
//  * Finds the line number of the closing curly brace `}` that corresponds to an opening brace `{` on a given line.
//  *
//  * This function is used to determine the scope of code blocks, such as classes and functions,
//  * by finding the matching closing brace for an opening brace on the starting line.
//  *
//  * @param document The VS Code TextDocument representing the current code file.
//  * @param startingLine The line number where the opening curly brace `{` is located.
//  *
//  * @returns The line number of the matching closing curly brace `}`, or the document's line count
//  *          if a matching closing brace is not found within the document.
//  */
// function getClosingLine(document: TextDocument, startingLine: number): number {
//     let openBrackets = 1;
//     let closeBrackets = 0;
//     let currentLineNum = startingLine + 1;

//     while (currentLineNum < document.lineCount) {
//         const currentLineText = document.lineAt(currentLineNum).text;
//         openBrackets += (currentLineText.match(/{/g) || []).length;
//         closeBrackets += (currentLineText.match(/}/g) || []).length;

//         if (openBrackets === closeBrackets) {
//             return currentLineNum;
//         }
//         currentLineNum++;
//     }

//     return document.lineCount;
// }

// //<  END: generateLogMessage 

// export { logMessage, generateLogMessage, getMsgTargetLine, calculateSpaces };










