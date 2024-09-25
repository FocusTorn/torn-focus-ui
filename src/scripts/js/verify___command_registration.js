
const path = require('path');
const fs = require('fs');

const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const commandsJsonPath = 'src/extension/commands/_commands.json';
const commandsData = fs.readFileSync(commandsJsonPath, 'utf-8');
const jsonCommentsRegex = /\/\*[\s\S]*?\*\/|\/\/.*/g;
const commandsJsonWithoutComments = commandsData.replace(jsonCommentsRegex, '');
const commandsJson = JSON.parse(commandsJsonWithoutComments);






function getCommandFromFlag(flag) {
    return flag.substring(2);
}

function getRegisteredCommands() {
    const registrationFilePath = path.resolve(__dirname, '../../extension/helpers/registration.ts');
    const registrationFileContent = fs.readFileSync(registrationFilePath, 'utf-8');

    // Use a regular expression to find all command registrations
    const commandRegistrationRegex = /registerCommand\s*\(\s*['"]((?:torn-focus-ui\.)?[^'"]+)['"]\s*,/g;
    let match;

    const registeredCommands = [];
    while ((match = commandRegistrationRegex.exec(registrationFileContent)) !== null) {
        registeredCommands.push(match[1]);
    }

    return registeredCommands;
}





function findCommand(commandId) {
    const result = {
        packageJson: {
            command: [],
            menus: [],
        },
        commandsJson: {},
    };
    
    
    // Find command in package.json //>
    
    const commandEntry = packageJson.contributes.commands?.find((command) => command.command.includes(commandId));

    if (commandEntry) {
        result.packageJson.command.push(commandEntry.command);

        // Find menus and submenus
        for (const menuName in packageJson.contributes.menus || {}) {
            for (const menuItem of packageJson.contributes.menus[menuName]) {
                
                if (menuItem.command?.includes(commandId)) {
                    
                    
                    if (!menuItem.submenu) {
                        if (menuItem.group.match(/^(.*Submenu)\d+@\d+$/)) {
                            
                            result.packageJson.menus.push({
                                location: menuName,
                                group: 'none'
                            });

                        }else{
                            result.packageJson.menus.push({
                                location: menuName,
                                group: menuItem.group
                            });
                            
                        }
                        
                        
                        
                    } else {
                        const submenuMatch = menuItem.group.match(/^(.*Submenu)\d+@\d+$/);
                        if (submenuMatch && !result.packageJson.submenus.includes(`torn-focus-ui.${submenuMatch[1]}`)) {
                            result.packageJson.submenus.push(`torn-focus-ui.${submenuMatch[1]}`);
                        }
                    }
                    
                    
                }
            }
        }
    } //<
    
    // Find command in commands.json //>
    const fullCommandName = commandEntry?.command.replace('torn-focus-ui.', '');
    if (fullCommandName && commandsJson[fullCommandName]) {
        result.commandsJson.id = fullCommandName;
        result.commandsJson.caption = commandsJson[fullCommandName].name;

        // Check if "menu" or "submenu" exists
        if (commandsJson[fullCommandName].menu) {
            result.commandsJson.menu = JSON.parse(JSON.stringify(commandsJson[fullCommandName].menu));
        } else if (commandsJson[fullCommandName].submenu) {
            result.commandsJson.submenu = commandsJson[fullCommandName].submenu; // Add submenu property
        }
    } //<
    
    
    const registeredCommands = getRegisteredCommands();
    result.packageJson.isRegistered = registeredCommands.includes(`torn-focus-ui.${commandId}`);
    
    
    
    return { [commandId]: result };
    
}






// const commandFlag = '--revertIcon';
// if (commandFlag){

    
    
const args = process.argv.slice(2);
if (args.length > 0) {
    const commandFlag = args[0]; // Get the first argument (the flag)
    
    
    
    
    
    
    const commandToFind = getCommandFromFlag(commandFlag);
    const searchResult = findCommand(commandToFind);
    // console.log(searchResult);
    
    const yaml = require('js-yaml');
    const outputObject = {
        [commandToFind]: {
            packageJson: {
                registeredCommand: searchResult[commandToFind].packageJson.command[0],
                
                // isRegistered: searchResult[commandToFind].packageJson.isRegistered, // <-- Added isRegistered here

                ...(searchResult[commandToFind].packageJson.menus.length > 0 &&
                    searchResult[commandToFind].packageJson.menus.reduce((acc, menu, index) => {
                        acc[`menu-${index + 1}`] = {
                            name: menu.location,
                            group: menu.group,
                        };
                        return acc;
                    }, {})),
                    
            },
            commandsJson: searchResult[commandToFind].commandsJson,
        },
    };


const yamlOutput = yaml.dump(outputObject, { indent: 4 }); // Use 4 spaces for indentation


// const formattedYamlOutput = yamlOutput.replace(/(logMessage:)/g, '$1\n').replace(/(packageJson:|commandsJson:)/g, '\n$1');
// const formattedYamlOutput = yamlOutput.replace(/(commandsJson:)/g, '\n$1');


console.log(yamlOutput);


    
    
    
    
    
    

} else {
    console.log('Please provide a command to verify (e.g., --logMessage)');
}








/*


Can we change the yaml output from 

~~~
logMessage:
    packageJson:
        registeredCommand: torn-focus-ui.varLogger.logMessage
        menus:
            - 'location: editor/context, group: 1_modification1@0'
    commandsJson:
        id: varLogger.logMessage
        caption: Log Message
        menu:
            name: editor/context
            group: 1_modificatio
~~~
to            
~~~         
logMessage:
    packageJson:
        registeredCommand: torn-focus-ui.varLogger.logMessage
        menu:
            name: editor/context
            group: 1_modification
            
    commandsJson:
        id: varLogger.logMessage
        caption: Log Message
        menu:
            name: editor/context
            group: 1_modification
~~~            
if multiple menus in package        
~~~         
logMessage:
    packageJson:
        registeredCommand: torn-focus-ui.varLogger.logMessage
        menu:
            name: editor/context
            group: 1_modification
        menu:
            name: explorer/context
            group: navigation
            
    commandsJson:
        id: varLogger.logMessage
        caption: Log Message
        menu:
            name: editor/context
            group: 1_modification            
            
            
            
            
            
            
            
            
            
            
            
            
            

*/

// if (args.length > 0) {
//     const commandFlag = args[0]; // Get the first argument (the flag)
//     const commandToFind = getCommandFromFlag(commandFlag);

//     const searchResult = findCommand(commandToFind);


//     const modifiedOutput = {
//         [commandToFind]: {
//             packageJson: {
//                 command: searchResult[commandToFind].packageJson.command,
//                 // Keep menus as an array of objects
//                 menus: searchResult[commandToFind].packageJson.menus,
//                 submenus: searchResult[commandToFind].packageJson.submenus,
//             },
//             commandsJson: searchResult[commandToFind].commandsJson,
//         },
//     };

//     const formattedJson = JSON.stringify(modifiedOutput, null, 4);

//     let finalFormattedJson = formattedJson
//         .replace(/"command": \[\s+(.*?)\s+]/s, '"command": [ $1 ]')
//         .replace(/"submenus": \[\s+(.*?)\s+]/s, '"submenus": [ $1 ]')

//         .replace(/"menu": \{\s*(.*?)\s*\}/s, (_match, group1) => {
//             const cleanedGroup = group1.replace(/\s+/g, ' ');
//             return `"menu": { ${cleanedGroup} }`;
//         })

//         .replace(/"menus": \[\s*({.*?})\s*\]/s, (_match, group1) => {
//             if (group1.includes('{')) {
//                 const objects = group1.split('},');
//                 const formattedObjects = objects
//                     .map((obj) => {
//                         return `                ${obj.replace(/\s+/g, ' ').trim()}`;
//                     })
//                     .join(',\n            ');
//                 return `"menus": [\n${formattedObjects}\n            ]`;
//             } else {
//                 return `"menus": [ ${group1} ]`;
//             }
//         })
//         .replace(/(\s*\},\n)(\s*"commandsJson":)/s, '$1\n$2')
//         .replace(/(\s*\{\n)(\s*"packageJson":)/s, '$1\n$2');



//         finalFormattedJson = finalFormattedJson.replace(/"command": \[\s*"(.*?)"\s*\]/s, '"command": "$1"');


//         finalFormattedJson = finalFormattedJson.replace(/"([^"]+)":/g, '$1:');

//         finalFormattedJson = finalFormattedJson.replace(/: \{/g, ':');

//     console.log(finalFormattedJson);


















/*


output is:
~~~
revertIcon:
    packageJson:
        command:
            - torn-focus-ui.revertIcon
        menus:
            -
                location: torn-focus-ui.assignIconSubmenu
                group: assignIconSubmenu1@1
    commandsJson:
        id: revertIcon
        caption: Use Default Icon
        submenu: assignIconSubmenu

~~~
I would like
~~~
revertIcon:
    packageJson:
        registeredCommand: torn-focus-ui.revertIcon
        menus:
            - location: torn-focus-ui.assignIconSubmenu group: assignIconSubmenu1@1
            
    commandsJson:
        id: revertIcon
        caption: Use Default Icon
        submenu: assignIconSubmenu

~~~
if multiple menus
~~~
revertIcon:
    packageJson:
        registeredCommand: torn-focus-ui.revertIcon
        menus:
            - location: torn-focus-ui.assignIconSubmenu group: assignIconSubmenu1@1
            - location: torn-focus-ui.OtherMenu group: OtherMenu@1
            
    commandsJson:
        id: revertIcon
        caption: Use Default Icon
        submenu: assignIconSubmenu

~~~































So the revertIcon does not have a menu, it has a submenu but menu is bein g populated








revertIcon:

    packageJson:
        command: "torn-focus-ui.revertIcon",
        menus:
            { location: "torn-focus-ui.assignIconSubmenu", group: "assignIconSubmenu1@1" }

    commandsJson:
        id: "revertIcon",
        caption: "Use Default Icon",
        submenu: "assignIconSubmenu"










*/
