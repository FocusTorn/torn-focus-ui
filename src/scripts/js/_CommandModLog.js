

// //>
// const fs = require('fs');

// const packageJsonPath = './package.json';
// const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// const commandsJsonPath = 'src/extension/commands/_commands.json';
// const commandsData = fs.readFileSync(commandsJsonPath, 'utf-8');
// const jsonCommentsRegex = /\/\*[\s\S]*?\*\/|\/\/.*/g;
// const commandsJsonWithoutComments = commandsData.replace(jsonCommentsRegex, '');
// const commandsJson = JSON.parse(commandsJsonWithoutComments);

// function findCommand(commandId) {
//     const result = {
//         command:
//             packageJson.contributes.commands?.find((command) => command.command.includes(commandId))?.command || null,
//         inCommands: packageJson.contributes.commands?.some((command) => command.command.includes(commandId)) || false,
//         inMenus: false,
//         groups: [],
//         submenus: [],
//     };

//     for (const menuName in packageJson.contributes.menus || {}) {
//         for (const menuItem of packageJson.contributes.menus[menuName]) {
//             if (menuItem.command?.includes(commandId) && !menuItem.submenu) {
//                 result.inMenus = true;
//                 result.groups.push(menuItem.group);
//             }

//             const submenuMatch = menuItem.group.match(/^(.*Submenu)\d+@\d+$/);
//             if (submenuMatch && !result.submenus.includes(`torn-focus-ui.${submenuMatch[1]}`)) {
//                 result.submenus.push(`torn-focus-ui.${submenuMatch[1]}`);
//             }
//         }
//     }

//     const fullCommandName = packageJson.contributes.commands
//         ?.find((command) => command.command.includes(commandId))
//         ?.command.replace('torn-focus-ui.', '');

//     const commandsJsonData = {
//         id: fullCommandName,
//         caption: commandsJson[fullCommandName]?.name,
//         // biome-ignore lint/style/useNamingConvention: <explanation>
//         Menu: commandsJson[fullCommandName]?.menu
//             ? {
//                 location: commandsJson[fullCommandName].menu.name,
//                 group: commandsJson[fullCommandName].menu.group
//             }
//             : null, // Set to null if no menu is defined
//     };

//     return {
//         [commandId]: {
//             packageJson: {
//                 ...result,
//                 // biome-ignore lint/style/useNamingConvention: <explanation>
//                 Menus: result.groups, // Directly use the groups array
//             },
//             commandsJson: commandsJsonData,
//         },
//     };

// }


// // Example usage:
// const commandToFind = 'logMessage';
// const searchResult = findCommand(commandToFind);
// // console.log('Search Term:', commandToFind);

// console.log(searchResult);
// //<
/*







Starting from scratch, can you write me a script that

Use logMessage as commandToFind

* Populate the packageJson: {}
    - pull information from D:\_dev\torn-focus-ui\package.json
    - There be no hard coded values in the result set

* Populate the commandsJson: {}
    - pull data from from D:\_dev\torn-focus-ui\src\extension\commands\_commands.json
    - There be no hard coded values in the result set



with the expected output as
~~~
{
    logMessage: {
        packageJson: {
            command:  [ "torn-focus-ui.varLogger.logMessage" ]
            menus:    [ location: "editor/context", group: "1_modification1@0" ]
            submenus: [ "torn-focus-ui.assignIconSubmenu" ],
        },
        commandsJson: {
            id: "varLogger.logMessage",
            caption: "Log Message",
            menu:    { "name": "explorer/context", "group": "9_cutcopypaste" }
        },
    },
}
~~~
but instead it returns this
~~~
{
  logMessage: {
    packageJson: {
      command: [ "torn-focus-ui.varLogger.logMessage" ],
      Menus: [
        [Object ...]
      ],
      Submenus: [],
    },
    commandsJson: {
      id: "varLogger.logMessage",
      caption: "Log Message",
      Menu: [Object ...],
    },
  },
}










in script D:\_dev\torn-focus-ui\src\scripts\js\verify___command_registration4.js
How can I change the console output to have some blank lines, to go from 

~~~

logMessage:
    packageJson:
        registeredCommand: torn-focus-ui.varLogger.logMessage
        menu-1:
            name: editor/context
            group: 1_modification1@0
    commandsJson:
        id: varLogger.logMessage
        caption: Log Message
        menu:
            name: editor/context
            group: 1_modification
            
~~~
to            
~~~   
     
logMessage:
** BLANK LINE ADDED HERE **
    packageJson:
        registeredCommand: torn-focus-ui.varLogger.logMessage
        menu-1:
            name: editor/context
            group: 1_modification1@0
** BLANK LINE ADDED HERE **
    commandsJson:
        id: varLogger.logMessage
        caption: Log Message
        menu:
            name: editor/context
            group: 1_modification





            
            
            
            
            
            
            
            
            
            
            
            
            
            





The script creates a json object as such.


{
  "logMessage": {
    "packageJson": {
      "command": [
        "torn-focus-ui.varLogger.logMessage"
      ],
      "menus": [
        {
          "location": "editor/context",
          "group": "1_modification1@0"
        }
      ],
      "submenus": []
    },
    "commandsJson": {
      "id": "varLogger.logMessage",
      "caption": "Log Message",
      "menu": {
        "name": "editor/context",
        "group": "1_modification"
      }
    }
  }
}


Is there a way to make this more human readable?










In regards to the "menu" secion
What regex replacce would remove the line break and reduce consecutive spaces down to 1 space

{
    "logMessage": {
        "packageJson": {
            "command": [ "torn-focus-ui.varLogger.logMessage" ],
            "menus": [
                {
                    "location": "editor/context",
                    "group": "1_modification1@0"
                }
            ],
            "submenus": []
        },
        "commandsJson": {
            "id": "varLogger.logMessage",
            "caption": "Log Message",
            "menu": { "name": "editor/context",
                "group": "1_modification" }
        }
    }
}



















































submenu: [],
      dividerAfter: [],

{
  logMessage: {
    packageJson: {
      command: "torn-focus-ui.varLogger.logMessage",
      inCommands: true,
      inMenus: true,
      groups: [ "1_modification1@0" ],
      submenus: [ "torn-focus-ui.assignIconSubmenu" ],
      Menus: [ "1_modification1@0" ],
    },
    commandsJson: {
      id: "varLogger.logMessage",
      caption: "Log Message",
      Menu: [Object ...],
    },
  },
}
































*/