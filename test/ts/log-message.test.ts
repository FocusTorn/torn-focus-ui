import * as vscode from 'vscode';
import {Uri} from 'vscode';
import { getMsgTargetLine, generateLogMessage, calculateSpaces } from '../../src/extension/helpers/log-message';

//- VSCode mockup ---------------------->> 


jest.mock('vscode', () => ({
    uri: {
        parse: jest.fn(),
    },
    endOfLine: {
        lf: 1,
    },
}));


//---------------------------------------------------------------------------------------------------<<
//- MockTextDocument ------------------->> 


class MockTextDocument {
    private lines: string[];
    constructor(lines: string[]) { this.lines = lines; }
    // uri: Uri = { parse: jest.fn() } as Uri; 
    
    uri: Uri = {
        scheme: 'file',
        authority: '',
        path: '/mockFile.ts',
        query: '',
        fragment: '',
        fsPath: 'mockFile.ts',
        with: jest.fn(),
        toJSON: () => {
            throw new Error('Function not implemented.');
        }
    };

    
    
    
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

    
    getText(range?: vscode.Range): string {
        if (range) {
            // If a range is provided, return text within that range
            let text = '';
            for (let i = range.start.line; i <= range.end.line; i++) {
                const lineText = this.lines[i];
                if (i === range.start.line) {
                    text += lineText.substring(range.start.character);
                } else if (i === range.end.line) {
                    text += lineText.substring(0, range.end.character);
                } else {
                    text += lineText;
                }
                text += '\n';
            }
            return text.trimEnd();
        } else {
            // If no range, return the entire document text
            return this.lines.join('\n');
        }
    }

    
    
    get lineCount(): number { return this.lines.length; }
    offsetAt(_position: vscode.Position): number { throw new Error('Method not implemented.'); }
    positionAt(_offset: number): vscode.Position { throw new Error('Method not implemented.'); }
    getWordRangeAtPosition(_position: vscode.Position, _regex?: RegExp): vscode.Range | undefined { throw new Error('Method not implemented.'); }
    validateRange(_range: vscode.Range): vscode.Range { throw new Error('Method not implemented.'); }
    validatePosition(_position: vscode.Position): vscode.Position { throw new Error('Method not implemented.'); }
}


//---------------------------------------------------------------------------------------------------<<





describe('Target Line Tests (getMsgTargetLine)', () => {
    
    test('Inside Line Broken Array', () => { //>
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
    }); //<

    test('Inside Function', () => { //>
        const code = [
            'function myFunction() {',
            '  const localVar = 20;',
            '  console.log(localVar);',
            '}',
            'myFunction();'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 1, 'localVar')).toBe(2);
    }); //<

    test('Inside Array, followed by comment', () => { //>
        const code = [
            'const myArray = [ 1, 2, 3];',
            '// This is a comment line'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 0, 'myArray')).toBe(1);
    }); //<

    test('Inside Array, followed by code', () => { //>
        const code = [
            'const myArray = [ 1, 2, 3];',
            'const notherVar = 177',
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 0, 'myArray')).toBe(1);
    }); //<

    test('Empty Lines and Comments', () => { //>
        const code = [
            'const x = 5;',
            '',
            '// This is a comment',
            'console.log(x);'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 0, 'x')).toBe(1);
    }); //<
        
    test('Inside Template Literal', () => { //>
        const code = [
            'const name = "John";',
            'const greeting = `Hello, ${name}!`;',
            'console.log(greeting);'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 1, 'greeting')).toBe(2);
    }); //<

    test('Nested Structures, dictionary', () => { //>
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
        expect(getMsgTargetLine(document, 2, 'name')).toBe(5);
    }); //<
        
    test('Nested Structures, class -> func', () => { //>
        const code = [
            'class MyClass {',
            '  myFunction() {',
            '    const myVar = 42;',
            '  }',
            '}'
        ];
        const document = new MockTextDocument(code);
        expect(getMsgTargetLine(document, 2, 'myVar')).toBe(3);
    }); //<
    
}); 



describe('Log Message Tests (generateLogMessage)', () => {

    it('should include class and function names', () => { //>
        const code = [
            'class MyClass {',
            '  myFunction() {',
            '    const myVar = 42;',
            '  }',
            '}'
        ];
        const document = new MockTextDocument(code);
        const logMessage = generateLogMessage({
            document: document,
            selectedVar: 'myVar',
            lineOfSelectedVar: 2,
            insertEnclosingClass: true,
            insertEnclosingFunction: true
        });

        
        const expectedIndentation = calculateSpaces(document, 2);
        const expectedLogMessage = `${expectedIndentation}console.log('MyClass -> myFunction -> myVar:', myVar);\n`;
        expect(logMessage).toBe(expectedLogMessage); 

        
        
        // expect(logMessage).toBe('    console.log(\'MyClass -> myFunction -> myVar:\', myVar);\n');
        
        
    }); //<

    it('should not include a class name', () => { //>
        const code = [
            'function myFunction() {',
            '  const myVar = 42;',
            '}'
        ];
        const document = new MockTextDocument(code);
        const logMessage = generateLogMessage({
            document: document,
            selectedVar: 'myVar',
            lineOfSelectedVar: 1,
            insertEnclosingClass: false,
            insertEnclosingFunction: true
        });

        const expectedIndentation = calculateSpaces(document, 1);
        const expectedLogMessage = `${expectedIndentation}console.log('myFunction -> myVar:', myVar);\n`;
        expect(logMessage).toBe(expectedLogMessage); 
        
        
        
        
    }); //<

    it('should show class but not func name', () => { //>
        const code = [
            'class MyClass {',
            '  myFunction() {',
            '    const myVar = 42;',
            '  }',
            '}'
        ];
        const document = new MockTextDocument(code);
        const logMessage = generateLogMessage({
            document: document,
            selectedVar: 'myVar',
            lineOfSelectedVar: 2,
            insertEnclosingClass: true,
            insertEnclosingFunction: false
        });
        
        
        const expectedIndentation = calculateSpaces(document, 2);
        const expectedLogMessage = `${expectedIndentation}console.log('MyClass -> myVar:', myVar);\n`;
        expect(logMessage).toBe(expectedLogMessage); 
        
        
        
    });//<

    it('should not show class or func name', () => { //>
        const code = [
            'class MyClass {',
            '  myFunction() {',
            '    const myVar = 42;',
            '  }',
            '}'
        ];
        const document = new MockTextDocument(code);
        const logMessage = generateLogMessage({
            document: document,
            selectedVar: 'myVar',
            lineOfSelectedVar: 0,
            insertEnclosingClass: false,
            insertEnclosingFunction: false
        });

        const expectedIndentation = calculateSpaces(document, 2);
        const expectedLogMessage = `${expectedIndentation}console.log('myVar:', myVar);\n`;
        expect(logMessage).toBe(expectedLogMessage); 
        
        
    }); //<
    
    
});


















/*




D:\_dev\torn-focus-ui\src\extension\helpers\log-message.ts

is failing this test in D:\_dev\torn-focus-ui\test\ts\log-message.test.ts:

```

it('should not show class or func name', () => { //>
        const code = [
            'const myVar = 42;'
        ];
        const document = new MockTextDocument(code);
        const logMessage = generateLogMessage({
            document: document,
            selectedVar: 'myVar',
            lineOfSelectedVar: 0,
            insertEnclosingClass: false,
            insertEnclosingFunction: false
        });

        const expectedIndentation = calculateSpaces(document, 0);
        const expectedLogMessage = `${expectedIndentation}console.log('myVar:', myVar);\n`;
        expect(logMessage).toBe(expectedLogMessage); 
        
        
    }); //<


```
```

● Log Message Tests (generateLogMessage) › should not show class or func name                                           
                                                                                                                          
    expect(received).toBe(expected) // Object.is equality

    - Expected  - 0
    + Received  + 1

    +
      console.log('myVar:', myVar);
      ↵

      290 |         const expectedIndentation = calculateSpaces(document, 0);
      291 |         const expectedLogMessage = `${expectedIndentation}console.log('myVar:', myVar);\n`;
    > 292 |         expect(logMessage).toBe(expectedLogMessage); 
          |                            ^
      293 |
      294 |
      295 |     }); //<

      at Object.<anonymous> (test/ts/log-message.test.ts:292:28)
      
      
      
      
```



      
      
      
      
      
      
      
      
      
      



*/

