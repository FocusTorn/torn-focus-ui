const fs = require('fs');
const readline = require('readline');

// Load package.json
const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

function findCommand(commandId) {
    const result = {
        command: null, // Initialize command as null
        inCommands: false,
        inMenus: false,
        groups: [],
        submenus: [],
    };

    // Check commands section
    if (packageJson.contributes.commands) {
        const foundCommand = packageJson.contributes.commands.find(
            (command) => command.command.includes(commandId)
        );
        if (foundCommand) {
            result.inCommands = true;
            result.command = foundCommand.command; // Store the full command
        }
    }

    // Check menus section
    if (packageJson.contributes.menus) {
        for (const menuName in packageJson.contributes.menus) {
            for (const menuItem of packageJson.contributes.menus[menuName]) {
                // Check for direct commands in top-level menus
                if (menuItem.command && menuItem.command.includes(commandId) && !menuItem.submenu) {
                    result.inMenus = true;
                    result.groups.push(menuItem.group);
                }

                // Check if the group indicates a submenu
                const submenuMatch = menuItem.group.match(/^(.*Submenu)\d+@\d+$/);
                if (submenuMatch) {
                    const submenuId = `torn-focus-ui.${submenuMatch[1]}`; 

                    // Add the submenu ID directly if it's not already present
                    if (!result.submenus.includes(submenuId)) {
                        result.submenus.push(submenuId);
                    }
                }
            }
        }
    }

    // return result;
    return {
        [commandId]: { // Use commandId as the key
            packageJson: result // Nest the result object under 'package.json'
        }
    };

}


// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   // Prompt for command ID
//   rl.question('Enter the command ID to search for: ', (commandToFind) => {
//     const searchResult = findCommand(commandToFind);
//     console.log(searchResult);
//     rl.close();
//   });

// Example usage:
const commandToFind = 'revertIcon';
const searchResult = findCommand(commandToFind);
console.log('Search Term:', commandToFind);

console.log(searchResult);

/*


When running D:\_dev\torn-focus-ui\src\scripts\js\verify___command_registration.js revertIcon returns this
~~~
Search Term: revertIcon
{
  command: "torn-focus-ui.revertIcon",
  inCommands: true,
  inMenus: true,
  groups: [ "assignIconSubmenu1@1" ],
  submenus: [ "torn-focus-ui.assignIconSubmenu" ],
}
~~~
can we change that to be 
~~~

revertIcon: {
    package.json: {
        command: "torn-focus-ui.revertIcon",
        inCommands: true,
        inMenus: true,
        groups: [ "assignIconSubmenu1@1" ],
        submenus: [ "torn-focus-ui.assignIconSubmenu" ],
    }
}

~~~













*/
