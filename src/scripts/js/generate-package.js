const fs = require("fs");
const path = require("path");

const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const commandsJsonPath = 'src/extension/commands/_commands.json';
const commandsJson = fs.readFileSync(commandsJsonPath, 'utf-8');
const jsonCommentsRegex = /\/\*[\s\S]*?\*\/|\/\/.*/g;
const commandsJsonWithoutComments = commandsJson.replace(jsonCommentsRegex, '');
const commandsData = JSON.parse(commandsJsonWithoutComments);

const submenus = commandsData.submenus || {};
const commands = commandsData;
delete commands.submenus; // Remove the submenus property from commands



// Function to generate the "contributes.commands" array
function generateCommandsArray(commands) {
    return Object.entries(commands).map(([commandKey, cmd]) => {
        // Ignore objects that are submenus
        if (commandKey.endsWith("Submenu")) {
            return null; // Skip submenus
        }

        return ({
            // title: `FT-UI: ${cmd.group ? `${cmd.group} > ` : ''}${cmd.name}`,
            title: `FT-UI: ${cmd.group ? cmd.group + ' > ' : ''}${cmd.name}`,



            command: `torn-focus-ui.${cmd.command || commandKey}`
        });
    }).filter(command => command !== null); // Remove null entries (submenus)
}







// function generateMenusObject(commands, submenus) {
//     packageJson.contributes.menus = {};
//     packageJson.contributes.submenus = [];

//     return Object.entries(commands).reduce((menus, [commandKey, cmd]) => {
//         let menuId = getMenuId(commandKey, cmd);

//         if (menuId) {
//             menus[menuId] = menus[menuId] || [];
//             menus[menuId].push({
//                 group: getGroup(cmd),
//                 command: `torn-focus-ui.${cmd.command || commandKey}`
//             });
//         }

//         if (commandKey.endsWith("Submenu")) {
//             packageJson.contributes.submenus.push({
//                 label: cmd.label,
//                 id: `torn-focus-ui.${commandKey}`,
//             });
//         }

//         return menus;
//     }, {});
// }

// function getMenuId(commandKey, cmd) {
//     if (commandKey.endsWith("Submenu")) {
//         return cmd.location;
//     } else if (cmd.menu) {
//         return cmd.menu.name;
//     } else if (cmd.submenu && commands[cmd.submenu]) {
//         return `torn-focus-ui.${cmd.submenu}`;
//     }
//     return null;
// }




// function getGroup(cmd) {
//     if (cmd.menu) {
//       return cmd.menu.group || '1';
//     }

//     if (cmd.submenu) {
//       return `${cmd.submenu}@${cmd.subgroup ? cmd.subgroup + '@1' : '1'}`;
//     }

//     return '1';
//   }



// function getGroup(cmd) {
//     let group = '1'; // Default group

//     if (cmd.menu && cmd.menu.group) {
//       group = cmd.menu.group;
//     } else if (cmd.submenu) {
//       group = `${cmd.submenu}@${cmd.subgroup !== undefined ? cmd.subgroup + '@1' : '1'}`;
//     }

//     return group;
//   }


// function getGroup(cmd) {
//     if (cmd.menu) {
//         return cmd.menu.group || '1';
//     }

//     if (cmd.submenu) {
//         return `${cmd.submenu}@${cmd.subgroup !== undefined ? cmd.subgroup + '@1' : '1'}`;
//     }

//     return '1';
// }




















// function generateMenusObject(commands, submenus) {
//     const menus = {};

//     // Clear original menu sections
//     packageJson.contributes.menus = {};
//     packageJson.contributes.submenus = [];

//     // Iterate over commands
//     for (const [commandKey, cmd] of Object.entries(commands)) {
//         let menuId = null;

//         if (commandKey.endsWith("Submenu")) {
//             // Handle submenus
//             packageJson.contributes.submenus.push({
//                 label: cmd.label,
//                 id: `torn-focus-ui.${commandKey}`,
//             });
//             menuId = cmd.location; // Submenu reference goes to its location
//         } else if (cmd.menu) {
//             // Handle commands with a 'menu' property
//             menuId = cmd.menu.name;
//         } else if (cmd.submenu && commands[cmd.submenu]) {
//             // Handle commands within a submenu
//             menuId = `torn-focus-ui.${cmd.submenu}`;
//         }

//         // Add menu item if menuId is defined
//         if (menuId) {
//             menus[menuId] = menus[menuId] || [];
//             menus[menuId].push({
//                 group: getGroup(cmd),
//                 command: `torn-focus-ui.${cmd.command || commandKey}`
//             });
//         }
//     }

//     return menus;
// }

// // Helper function to determine the group for a menu item
// function getGroup(cmd) {
//     if (cmd.menu) {
//         return cmd.menu.group || '1'; // Default group if not specified
//     } else if (cmd.submenu) {
//         return `${cmd.submenu}@${cmd.subgroup !== undefined ? cmd.subgroup + '@1' : '1'}`;
//     }
//     return '1'; // Default group for commands without menu or submenu
// }
















// function generateMenusObject(commands, submenus) {
//     const menus = {};

//     // Clear original menu sections
//     packageJson.contributes.menus = {};
//     packageJson.contributes.submenus = [];

//     // Helper function to add a menu item
//     function addMenuItem(menuId, commandKey, cmd) {
//         menus[menuId] = menus[menuId] || [];

//         // Handle subgroup for menu item grouping
//         let group = cmd.menu ? cmd.menu.group : `${cmd.submenu}@`;
//         group = cmd.subgroup !== undefined
//             ? `${cmd.submenu}${cmd.subgroup}@1`
//             : `${group}1`;

//         menus[menuId].push({
//             group: group,
//             command: `torn-focus-ui.${cmd.command || commandKey}`
//         });
//     }

//     // Iterate over commands and submenus
//     for (const [commandKey, cmd] of Object.entries(commands)) {
//         if (commandKey.endsWith("Submenu")) {
//             // Add submenu to package.json
//             packageJson.contributes.submenus.push({
//                 label: cmd.label,
//                 id: `torn-focus-ui.${commandKey}`,
//             });

//             // Add submenu REFERENCE to the menus object
//             addMenuItem(cmd.location, commandKey, cmd);
//         } else {
//             // Handle regular commands
//             let menuId = cmd.menu ? cmd.menu.name : null;
//             if (cmd.submenu && commands[cmd.submenu]) {
//                 menuId = `torn-focus-ui.${cmd.submenu}`;
//             }

//             if (menuId) {
//                 addMenuItem(menuId, commandKey, cmd);
//             }
//         }
//     }

//     return menus;
// }
















// Original Function to generate the "contributes.menus" object
function generateMenusObject(commands, submenus) {
    const menus = {};

    //- Clear original menu sections -------------
    packageJson.contributes.menus = {};
    packageJson.contributes.submenus = [];

    //- Add commands to menus --------------------
    for (const key in commands) {
        if (key.endsWith("Submenu")) {
            const submenuName = key;
            const submenu = commands[key];

            // Add submenu to package.json
            packageJson.contributes.submenus.push({
                label: submenu.label,
                id: `torn-focus-ui.${submenuName}`,
            });

            // Add submenu REFERENCE to the menus object using the submenu's location
            menus[submenu.location] = menus[submenu.location] || [];
            menus[submenu.location].push({
                group: submenu.group,
                submenu: `torn-focus-ui.${submenuName}`,
            });
        }

        // --- Handle regular commands ---
        else {
            const cmd = commands[key];
            let menuId = cmd.menu ? cmd.menu.name : null;

            if (cmd.submenu && commands[cmd.submenu]) {
                menuId = `torn-focus-ui.${cmd.submenu}`;
            }

            if (menuId) {
                menus[menuId] = menus[menuId] || [];

                // Handle subgroup for menu item grouping
                let group = cmd.menu ? cmd.menu.group : `${cmd.submenu}@`;
                group = cmd.subgroup !== undefined ? `${cmd.submenu}${cmd.subgroup}@1` : `${group}1`;

                menus[menuId].push({
                    group: group,
                    command: `torn-focus-ui.${cmd.command || key}`
                });
            }
        }
    }
    return menus;
}














// --- Language Icons Logic ---
const languagesModule = require('../../dict/language_icons.model.js');
const iconPath = './assets/icons/file_icons/';
const languages = languagesModule.languages;

const formattedLanguages = languages.icons.map(lang => ({
    id: lang.id,
    icon: {
        light: `${iconPath}${lang.icon}`,
        dark: `${iconPath}${lang.icon}`
    }
}));





packageJson.contributes.commands = generateCommandsArray(commands);
packageJson.contributes.menus = generateMenusObject(commands, submenus);
packageJson.contributes.languages = formattedLanguages;




fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));


























// I need the above to to be added to the package.json file in section "languages": [
// in this format :

// {
//     "id": "ahk",
//     "icon": {
//         "light": "./assets/icons/file_icons/ahk.svg",
//         "dark": "./assets/icons/file_icons/ahk.svg"
//     }
// },
// {
//     "id": "bat",
//     "icon": {
//         "light": "./assets/icons/file_icons/terminal.svg",
//         "dark": "./assets/icons/file_icons/terminal.svg"
//     }
// },
// {
//     "id": "c",
//     "icon": {
//         "light": "./assets/icons/file_icons/c.svg",
//         "dark": "./assets/icons/file_icons/c.svg"
//     }
// },

// in addition if there is only one icon key add the path to both the light and dark icon sub keys within an icon object,
// if there is a dark and a light key, add the paths to their respective icon sub keys within an icon object




















//cspell:disable

// trial phrase to do || trialPhraseToDo

// trialPhraseToDo||TrialPhraseToDo            Ctrl_T+Ctrl_(C) amel case
// trial phrase to do || trial-phrase-to-do    Ctrl_T+Ctrl_(K) ebob case
// trial phrase to do || trialphrasetodo       Ctrl_T+Ctrl_(L) ower case
// TrialPhraseToDo||TrialPhraseToDo            Ctrl_T+Ctrl_(P) ascal case
// trial phrase to do || trial_phrase_to_do    Ctrl_T+Ctrl_(S) nake case
// Trial Phrase To Do || Trialphrasetodo       Ctrl_T+Ctrl_(T) itle case
// TRIAL PHRASE TO DO || TRIALPHRASETODO       Ctrl_T+Ctrl_(U) pper case
