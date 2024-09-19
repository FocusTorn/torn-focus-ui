import * as vscode from 'vscode';

const CLASS_DECLARATION_REGEX = /class\s+([a-zA-Z]+)\s*(.*)\s*{/;
const OBJECT_DECLARATION_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*{/;

// Valid
const ARRAY_DECLARATION_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*\[/;

const FUNCTION_CALL_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*.*\(.*/;
const OBJECT_FUNCTION_CALL_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*.*[a-zA-Z0-9]*\./;
const NAMED_FUNCTION_DECLARATION_REGEX = /([a-zA-Z]+)\s*\(.*\)\s*{/;
const NON_NAMED_FUNCTION_DECLARATION_REGEX = /function\s*\(.*\)\s*{/;
const NAMED_FUNCTION_EXPRESSION_REGEX = /([a-zA-Z]+)\s*=\s*(function)?\s*[a-zA-Z]*\s*\(.*\)\s*(=>)?\s*{/;
const JS_BUILT_IN_STATEMENT_REGEX = /(if|switch|while|for|catch)\s*\(.*\)\s*{/;

interface LogMessageOptions {
    document: vscode.TextDocument;
    selectedVar: string;
    lineOfSelectedVar: number;
    insertEnclosingClass: boolean;
    insertEnclosingFunction: boolean;
}

//- getMsgTargetLine ------------->>


function getMsgTargetLine(document: vscode.TextDocument, selectionLine: number, selectedVar: string): number {

    // Check if selection is on last line of document
    if (selectionLine === document.lineCount - 1) {
        return selectionLine;
    }

    let currentLineNum = selectionLine;
    let currentLineText = document.lineAt(currentLineNum).text;






    while (currentLineNum < document.lineCount) {


        // Get text of next line if there is one, else be blank
        let nextLineText = currentLineNum < document.lineCount - 1
            ? document.lineAt(currentLineNum + 1).text.replace(/\s/g, '')
            : '';



        // Prioritize checks that span multiple lines
        if (isObject(currentLineText) ||
            isArray(currentLineText, nextLineText) ||
            isInlineFunctionCall(currentLineText, selectedVar, isObjectFunctionCall, nextLineText) ||
            isObjectFunctionCall(currentLineText, nextLineText) ||
            isFunctionCall(currentLineText) ||
            /`/.test(currentLineText)) {


            const DelimiterPair = getDelimiterPair(currentLineText);


            currentLineNum = findClosingDelimiterLine(
                document,
                currentLineNum,
                DelimiterPair.open,
                DelimiterPair.close
            );

            // Update current line
            currentLineText = document.lineAt(currentLineNum).text;

            // Check if we're still within a block
            // continue;
        }

        
        // Simple case: return statement
        if (currentLineText.trim().startsWith('return')) {
            return currentLineNum;
        }

        
        
        
    //- v1 --------------------------------------- 
        
        // return currentLineNum + 1;

    //- v2 --------------------------------------- 
        
        // if (currentLineNum > selectionLine && 
        //     !currentLineText.trim().startsWith('}') &&
        //     !currentLineText.trim().startsWith(']') &&
        //     !currentLineText.trim().startsWith(')')
        //    ) {
        //     return currentLineNum;
        // }
        
    //- v3 --------------------------------------- 
        
        const closingDelimiters = [')', ']', '}'];
        if (currentLineNum > selectionLine &&
            !closingDelimiters.some(delimiter => currentLineText.trim().startsWith(delimiter))) {
            return currentLineNum;
        }


        currentLineNum++;


    }







    // Default if we reach the end
    return selectionLine;
}


//---------------------------------------------------------------------------------------------------<<
//- getEnclosingBlockName --------------->>


function getEnclosingBlockName(document: vscode.TextDocument, lineOfSelectedVar: number, blockType: 'class' | 'function'): string {
    for (let currentLineNum = lineOfSelectedVar; currentLineNum >= 0; currentLineNum--) {
        const currentLineText = document.lineAt(currentLineNum).text;

        const isClassDeclaration = blockType === 'class' && isClass(currentLineText);
        const isFunctionDeclaration = blockType === 'function' &&
            isFunction(currentLineText) &&
            !isJSBuiltInStatement(currentLineText);

        if (isClassDeclaration || isFunctionDeclaration) {
            const closingBraceLine = getClosingLine(document, currentLineNum);

            if (lineOfSelectedVar >= currentLineNum && lineOfSelectedVar < closingBraceLine) {
                if (isClassDeclaration) {
                    return `${getClassName(currentLineText)} -> `;
                } else {
                    const functionName = getFunctionName(currentLineText);
                    return functionName ? `${functionName} -> ` : '';
                }
            }
        }
    }
    return '';
}


//---------------------------------------------------------------------------------------------------<<
//- findClosingDelimiterLine ------------>>


function findClosingDelimiterLine(document: vscode.TextDocument, selectionLine: number,
    openDelimiter: string, closeDelimiter: string): number {

    const escapedOpenDelimiter = openDelimiter.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const escapedCloseDelimiter = closeDelimiter.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    let openCount = (RegExp(escapedOpenDelimiter, 'g').exec(document.lineAt(selectionLine).text) || []).length;
    let closeCount = (RegExp(escapedCloseDelimiter, 'g').exec(document.lineAt(selectionLine).text) || []).length;

    let currentLineNum = selectionLine + 1;

    if (openCount !== closeCount) {
        while (currentLineNum < document.lineCount) {
            const currentLineText = document.lineAt(currentLineNum).text;

            // Use escaped delimiters here as well
            openCount += (RegExp(escapedOpenDelimiter, 'g').exec(currentLineText) || []).length;
            closeCount += (RegExp(escapedCloseDelimiter, 'g').exec(currentLineText) || []).length;

            if (openCount === closeCount) {
                break;
            }
            currentLineNum++;
        }
    }

    
//- v1 --------------------------------------- 
    
    // return openCount === closeCount ? currentLineNum : selectionLine + 1;
    
//- v2 --------------------------------------- 
    
    return openCount === closeCount ? currentLineNum : selectionLine;
    
    
}



//---------------------------------------------------------------------------------------------------<<
//- getClosingLine ---------------------->>

function getClosingLine(document: vscode.TextDocument, startingLine: number): number {
    let openBrackets = 1;
    let closeBrackets = 0;
    let currentLineNum = startingLine + 1;

    while (currentLineNum < document.lineCount) {
        const currentLineText = document.lineAt(currentLineNum).text;
        openBrackets += (currentLineText.match(/{/g) || []).length;
        closeBrackets += (currentLineText.match(/}/g) || []).length;

        if (openBrackets === closeBrackets) {
            return currentLineNum;
        }
        currentLineNum++;
    }

    return document.lineCount;
}

//---------------------------------------------------------------------------------------------------<<
//- generateLogMessage ------------------>>


function generateLogMessage(options: LogMessageOptions): string {
    const {
        document,
        selectedVar,
        lineOfSelectedVar,
        insertEnclosingClass,
        insertEnclosingFunction,
    } = options;

    const classThatEncloseTheVar = getEnclosingBlockName(document, lineOfSelectedVar, 'class');
    const funcThatEncloseTheVar = getEnclosingBlockName(document, lineOfSelectedVar, 'function');

    const lineOfLogMsg = getMsgTargetLine(document, lineOfSelectedVar, selectedVar);
    const spacesBeforeMsg = calculateSpaces(document, lineOfSelectedVar);







    const debuggingMsg = `console.log('${insertEnclosingClass ? classThatEncloseTheVar : ''}${insertEnclosingFunction ? funcThatEncloseTheVar : ''} ${selectedVar}:' , ${selectedVar});`;



    return `${lineOfLogMsg === document.lineCount ? '\n' : ''}${spacesBeforeMsg}${debuggingMsg}\n`;
}


//---------------------------------------------------------------------------------------------------<<

export { generateLogMessage, getMsgTargetLine, calculateSpaces };




//>  START: HELPERS  


function calculateSpaces(document: vscode.TextDocument, line: number): string {
    const currentLine = document.lineAt(line);
    const firstNonWhitespaceIndex = currentLine.firstNonWhitespaceCharacterIndex;
    return ' '.repeat(firstNonWhitespaceIndex);
}

function getDelimiterPair(line: string): { open: string, close: string } {
    if (/{/.test(line)) { return { open: '{', close: '}' }; }
    if (/\[/.test(line)) { return { open: '[', close: ']' }; }
    if (/\(/.test(line)) { return { open: '(', close: ')' }; }
    if (/`/.test(line)) { return { open: '`', close: '`' }; }
    return { open: '', close: '' };
}



function isClass(lineCode: string): boolean {
    return CLASS_DECLARATION_REGEX.test(lineCode);
}
function isObject(lineCode: string): boolean {
    return OBJECT_DECLARATION_REGEX.test(lineCode);
}
function isArray(lineCode: string, nextLineCode?: string): boolean {
    return ARRAY_DECLARATION_REGEX.test(lineCode) ||
        (/(const|let|var)?\s*[a-zA-Z0-9]*\s*=\s*.*[a-zA-Z0-9]*/.test(lineCode) &&
            (nextLineCode ? nextLineCode.trim().startsWith("[") : false));
}
function isJSBuiltInStatement(lineCode: string): boolean {
    return JS_BUILT_IN_STATEMENT_REGEX.test(lineCode);
}



function isFunction(lineCode: string): boolean {
    return NAMED_FUNCTION_DECLARATION_REGEX.test(lineCode) ||
        NAMED_FUNCTION_EXPRESSION_REGEX.test(lineCode);
}
function isFunctionCall(lineCode: string): boolean {
    return FUNCTION_CALL_REGEX.test(lineCode);
}
function isInlineFunctionCall(currentLineText: string, selectedVar: string, checkFunction: (line: string, nextLine?: string) => boolean, nextLineText?: string): boolean {
    return checkFunction(currentLineText, nextLineText) &&
        (/\((\s*)$/.test(currentLineText.split(selectedVar)[0]) || /,(\s*)$/.test(currentLineText.split(selectedVar)[0]));
}
function isObjectFunctionCall(lineCode: string, nextLineCode?: string): boolean {
    return OBJECT_FUNCTION_CALL_REGEX.test(lineCode) ||
        (/(const|let|var)?\s*[a-zA-Z0-9]*\s*=\s*.*[a-zA-Z0-9]*/.test(lineCode) &&
            (nextLineCode ? nextLineCode.trim().startsWith(".") : false));
}



function getClassName(lineCode: string): string {
    const match = RegExp(CLASS_DECLARATION_REGEX).exec(lineCode);
    return match ? match[1].trim() : '';
}
function getFunctionName(lineCode: string): string {
    let match = RegExp(NAMED_FUNCTION_DECLARATION_REGEX).exec(lineCode);
    if (match) { return match[1].trim(); }

    match = RegExp(NAMED_FUNCTION_EXPRESSION_REGEX).exec(lineCode);
    if (match) { return match[1].trim(); }

    return '';
}

//<  END: HELPERS 




