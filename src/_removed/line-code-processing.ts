const CLASS_DECLARATION_REGEX = /class\s+([a-zA-Z]+)\s*(.*)\s*{/;
const OBJECT_DECLARATION_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*{/;
const ARRAY_DECLARATION_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*\[/;
const FUNCTION_CALL_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*.*\(.*/;
const OBJECT_FUNCTION_CALL_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*.*[a-zA-Z0-9]*\./;
const NAMED_FUNCTION_DECLARATION_REGEX = /([a-zA-Z]+)\s*\(.*\)\s*{/;
const NON_NAMED_FUNCTION_DECLARATION_REGEX = /function\s*\(.*\)\s*{/;
const NAMED_FUNCTION_EXPRESSION_REGEX = /([a-zA-Z]+)\s*=\s*(function)?\s*[a-zA-Z]*\s*\(.*\)\s*(=>)?\s*{/;
const JS_BUILT_IN_STATEMENT_REGEX = /(if|switch|while|for|catch)\s*\(.*\)\s*{/;

function isClassDeclaration(lineCode: string): boolean {
    return CLASS_DECLARATION_REGEX.test(lineCode);
}

function getClassName(lineCode: string): string {
    const match = RegExp(CLASS_DECLARATION_REGEX).exec(lineCode);
    return match ? match[1].trim() : '';
}

function isObjectDeclaration(lineCode: string): boolean {
    return OBJECT_DECLARATION_REGEX.test(lineCode);
}

function isArrayDeclaration(lineCode: string, nextLineCode?: string): boolean {
    return ARRAY_DECLARATION_REGEX.test(lineCode) || 
           (/(const|let|var)?\s*[a-zA-Z0-9]*\s*=\s*.*[a-zA-Z0-9]*/.test(lineCode) && 
            (nextLineCode ? nextLineCode.trim().startsWith("[") : false)); 
}

function isFunctionCallDeclaration(lineCode: string): boolean {
    return FUNCTION_CALL_REGEX.test(lineCode);
}

function isObjectFunctionCallDeclaration(lineCode: string, nextLineCode?: string): boolean {
    return OBJECT_FUNCTION_CALL_REGEX.test(lineCode) || 
           (/(const|let|var)?\s*[a-zA-Z0-9]*\s*=\s*.*[a-zA-Z0-9]*/.test(lineCode) && 
            (nextLineCode ? nextLineCode.trim().startsWith(".") : false)); 
}

function isFunctionDeclaration(lineCode: string): boolean {
    return NAMED_FUNCTION_DECLARATION_REGEX.test(lineCode) || 
           NAMED_FUNCTION_EXPRESSION_REGEX.test(lineCode);
}

function isJSBuiltInStatement(lineCode: string): boolean {
    return JS_BUILT_IN_STATEMENT_REGEX.test(lineCode);
}

function getFunctionName(lineCode: string): string {
    let match = RegExp(NAMED_FUNCTION_DECLARATION_REGEX).exec(lineCode);
    if (match) {return match[1].trim();}

    match = RegExp(NAMED_FUNCTION_EXPRESSION_REGEX).exec(lineCode);
    if (match) {return match[1].trim();}

    return ''; 
}

export {
    isClassDeclaration,
    getClassName,
    isObjectDeclaration,
    isArrayDeclaration,
    isFunctionCallDeclaration,
    isObjectFunctionCallDeclaration,
    isFunctionDeclaration,
    isJSBuiltInStatement,
    getFunctionName
};



















    export function checkIfFunction(currentLineText: string) {
        throw new Error('Function not implemented.');
    }
// const CLASS_DECLARATION_REGEX = /class\s+([a-zA-Z]+)\s*(.*)\s*{/;
// const OBJECT_DECLARATION_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*{/;
// const ARRAY_DECLARATION_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*\[/;
// const FUNCTION_CALL_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*.*\(.*/;
// const OBJECT_FUNCTION_CALL_REGEX = /(const|let|var)?\s*([a-zA-Z0-9]*)\s*=\s*.*[a-zA-Z0-9]*\./;
// const NAMED_FUNCTION_DECLARATION_REGEX = /([a-zA-Z]+)\s*\(.*\)\s*{/;
// const NON_NAMED_FUNCTION_DECLARATION_REGEX = /function\s*\(.*\)\s*{/;
// const NAMED_FUNCTION_EXPRESSION_REGEX = /([a-zA-Z]+)\s*=\s*(function)?\s*[a-zA-Z]*\s*\(.*\)\s*(=>)?\s*{/;
// const JS_BUILT_IN_STATEMENT_REGEX = /(if|switch|while|for|catch)\s*\(.*\)\s*{/;


// function checkClassDeclaration(lineCode: string): boolean {
//     const classNameRegex: RegExp = /class(\s+)[a-zA-Z]+(.*){/;
//     return classNameRegex.test(lineCode);
// }

// function checkObjectDeclaration(lineCode: string): boolean {
//     const objectRejex: RegExp = /(const|let|var)?(\s*)[a-zA-Z0-9]*(\s*)=(\s*){/;
//     return objectRejex.test(lineCode);
// }

// function checkArrayDeclaration(lineCodeSelectionLine: string, lineCodeSelectionNextLine: string): boolean {
//     const arrayDeclarationRejex: RegExp = /(const|let|var)?(\s*)[a-zA-Z0-9]*(\s*)=(\s*)\[/;
//     return arrayDeclarationRejex.test(lineCodeSelectionLine) || (/(const|let|var)?(\s*)[a-zA-Z0-9]*(\s*)=(\s*).*[a-zA-Z0-9]*/.test(lineCodeSelectionLine) && lineCodeSelectionNextLine.startsWith("["));
// }

// function checkFunctionCallDeclaration(lineCode: string): boolean {
//     const functionCallDeclarationRejex: RegExp = /(const|let|var)?(\s*)[a-zA-Z0-9]*(\s*)=(\s*).*\(.*/;
//     return functionCallDeclarationRejex.test(lineCode);
// }

// function checkObjectFunctionCallDeclaration(lineCodeSelectionLine: string, lineCodeSelectionNextLine?: string): boolean { 
//     const objectFunctionCallDeclaration: RegExp = /(const|let|var)?(\s*)[a-zA-Z0-9]*(\s*)=(\s*).*[a-zA-Z0-9]*\./;
//     return objectFunctionCallDeclaration.test(lineCodeSelectionLine) || (/(const|let|var)?(\s*)[a-zA-Z0-9]*(\s*)=(\s*).*[a-zA-Z0-9]*/.test(lineCodeSelectionLine) && lineCodeSelectionNextLine.startsWith("."));
// }

// function className(lineCode: string): string {
//     if (lineCode.split(/class /).length >= 2) {
//         const textInTheRightOfClassKeyword: string = lineCode.split(/class /)[1].trim();
//         if (textInTheRightOfClassKeyword.split(" ").length > 0) {
//             return textInTheRightOfClassKeyword.split(" ")[0].replace("{", "");
//         } else {
//             return textInTheRightOfClassKeyword.replace("{", "");
//         }
//     }
//     return "";
// }

// function checkIfFunction(lineCode: string): boolean {
//     const namedFunctionDeclarationRegex: RegExp = /[a-zA-Z]+(\s*)\(.*\)(\s*){/;
//     const nonNamedFunctionDeclaration: RegExp = /(function)(\s*)\(.*\)(\s*){/;
//     const namedFunctionExpressionRegex: RegExp = /[a-zA-Z]+(\s*)=(\s*)(function)?(\s*)[a-zA-Z]*(\s*)\(.*\)(\s*)(=>)?(\s*){/;
//     const isNamedFunctionDeclaration: boolean = namedFunctionDeclarationRegex.test(lineCode);
//     const isNonNamedFunctionDeclaration: boolean = nonNamedFunctionDeclaration.test(lineCode);
//     const isNamedFunctionExpression: boolean = namedFunctionExpressionRegex.test(lineCode);
//     return (
//         (isNamedFunctionDeclaration && !isNonNamedFunctionDeclaration) ||
//         isNamedFunctionExpression
//     );
// }

// function checkIfJSBuiltInStatement(lineCode: string): boolean {
//     const jSBuiltInStatement: RegExp = /(if|switch|while|for|catch)(\s*)\(.*\)(\s*){/;
//     return jSBuiltInStatement.test(lineCode);
// }

// function functionName(lineCode: string): string {
//     if (/function(\s+)[a-zA-Z]+(\s*)\(.*\)(\s*){/.test(lineCode)) {
//         if (lineCode.split("function ").length > 1) {
//             return lineCode
//                 .split("function ")[1]
//                 .split("(")[0]
//                 .replace(/(\s*)/g, "");
//         }
//     } else if (lineCode.split(/\(.*\)/).length > 0) {
//         const textInTheLeftOfTheParams: string = lineCode.split(/\(.*\)/)[0];
//         if (/=/.test(textInTheLeftOfTheParams)) {
//             if (textInTheLeftOfTheParams.split("=").length > 0) {
//                 return textInTheLeftOfTheParams
//                     .split("=")[0]
//                     .replace(/export |module.exports |const |var |let |=|(\s*)/g, "");
//             }
//         } else {
//             return textInTheLeftOfTheParams.replace(/async|public|private|protected|static|export |(\s*)/g, "");
//         }
//     }
//     return "";
// }

// export {
//     checkClassDeclaration,
//     checkObjectDeclaration,
//     checkArrayDeclaration,
//     checkFunctionCallDeclaration,
//     checkObjectFunctionCallDeclaration,
//     className,
//     checkIfFunction,
//     checkIfJSBuiltInStatement,
//     functionName
// };


















