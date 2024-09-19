import * as vscode from 'vscode';
import { getMsgTargetLine } from '../../src/extension/helpers/log-message';

//- VSCode mockup ---------------------->> 


jest.mock('vscode', () => ({
    Uri: {
        parse: jest.fn(),
    },
    EndOfLine: {
        LF: 1,
    },
}));


//---------------------------------------------------------------------------------------------------<<
//- MockTextDocument ------------------->> 


class MockTextDocument {
    private lines: string[];
    constructor(lines: string[]) { this.lines = lines; }
    uri: import('vscode').Uri = { parse: jest.fn() } as any;
    fileName = 'mockFile.ts';
    isUntitled = false;
    languageId = 'typescript';
    version = 1;
    isDirty = false;
    isClosed = false;
    save = jest.fn();
    eol = 1;

    lineAt(line: number): vscode.TextLine;
    lineAt(position: vscode.Position): vscode.TextLine;
    lineAt(arg: number | vscode.Position): vscode.TextLine {
        if (typeof arg === 'number') { return { text: this.lines[arg] } as vscode.TextLine; }
        else { return { text: this.lines[arg.line] } as vscode.TextLine; }
    }

    get lineCount(): number { return this.lines.length; }
    offsetAt(position: vscode.Position): number { throw new Error('Method not implemented.'); }
    positionAt(offset: number): vscode.Position { throw new Error('Method not implemented.'); }
    getText(range?: vscode.Range): string { throw new Error('Method not implemented.'); }
    getWordRangeAtPosition(position: vscode.Position, regex?: RegExp): vscode.Range | undefined { throw new Error('Method not implemented.'); }
    validateRange(range: vscode.Range): vscode.Range { throw new Error('Method not implemented.'); }
    validatePosition(position: vscode.Position): vscode.Position { throw new Error('Method not implemented.'); }
}


//---------------------------------------------------------------------------------------------------<<

describe('Log Message Tests', () => {


    test('getMsgTargetLine - Inside Function', () => {
        const code = [
            'function myFunction() {',
            '  const localVar = 20;',
            '  console.log(localVar);',
            '}',
            'myFunction();'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 1, 'localVar')).toBe(2);
    });



    test('getMsgTargetLine - Inside Array, followed by CLog', () => {
        const code = [
            'const myArray = [ 1, 2, 3];',
            'console.log(myArray[0]);'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 0, 'myArray')).toBe(1);
    });

    test('getMsgTargetLine - Inside Array, followed by other', () => {
        const code = [
            'const myArray = [ 1, 2, 3];',
            'const notherVar = 177',
            'console.log(myArray[0]);'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 0, 'myArray')).toBe(1);
    });


    test('getMsgTargetLine - Inside Line Broken Array', () => {
        const code = [
            'const myArray = [',
            '    1,',
            '    2,',
            '    3',
            '];',
            'console.log(myArray[0]);'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 0, 'myArray')).toBe(5);
    });

    test('getMsgTargetLine - Inside Template Literal', () => {
        const code = [
            'const name = "John";',
            'const greeting = `Hello, ${name}!`;',
            'console.log(greeting);'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 1, 'greeting')).toBe(2);
    });

    test('getMsgTargetLine - Nested Structures', () => {
        const code = [
            'const data = {',
            '  person: {',
            '    name: "Alice",',
            '    age: 30',
            '  },',
            '  items: [1, 2, { id: "abc" }] ',
            '};',
            'console.log(data.person.name);'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 2, 'name')).toBe(3);
    });

    test('getMsgTargetLine - Empty Lines and Comments', () => {
        const code = [
            'const x = 5;',
            '',
            '// This is a comment',
            'console.log(x);'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 0, 'x')).toBe(1);
    });
});






// D:\_dev\torn-focus-ui\src\extension\helpers\log-message.ts

// is now failing this test:


// test('getMsgTargetLine - Inside Line Broken Array', () => {
//     const code = [
//         'const myArray = [',
//         '    1,',
//         '    2,',
//         '    3',
//         '];',
//         'console.log(myArray[0]);'
//     ];
//     const document = new MockTextDocument(code);
//     expect(getMsgTargetLine(document, 0, 'myArray')).toBe(5);
// });

// with a 

// Log Message Tests › getMsgTargetLine - Inside Line Broken Array
                                                                                                                    
//     expect(received).toBe(expected) // Object.is equality

//     Expected: 5
//     Received: 0

//        98 |         ];
//        99 |         const document = new MockTextDocument(code);
//     > 100 |         expect(getMsgTargetLine(document, 0, 'myArray')).toBe(5);
//           |                                                          ^
//       101 |     });
//       102 |
//       103 |     test('getMsgTargetLine - Inside Template Literal', () => {

//       at Object.<anonymous> (test/ts/log-message.test.ts:100:58)