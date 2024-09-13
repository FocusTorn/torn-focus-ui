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
            title: `FT-UI: ${cmd.group ? `${cmd.group} > ` : ''}${cmd.name}`,
            command: `torn-focus-ui.${cmd.command || commandKey}`
        });
    }).filter(command => command !== null); // Remove null entries (submenus)
}





// Function to generate the "contributes.menus" object
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

packageJson.contributes.commands = generateCommandsArray(commands);
packageJson.contributes.menus = generateMenusObject(commands, submenus);

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));












// function generateCommandsArray(commands) {
//     return Object.entries(commands).map(([commandKey, cmd]) => ({
//         title: `FT-UI: ${cmd.group ? `${cmd.group} > ` : ''}${cmd.name}`,
//         command: `torn-focus-ui.${cmd.command || commandKey}` // Use cmd.command or key
//     }));
// }





// for (const cmdName in commands) {
//     const cmd = commands[cmdName];
//     const commandName = cmd.command || cmdName;

//     let menuId = cmd.menu ? cmd.menu.name : null;


//     console.log(`Info: cmd.submenu = ${cmd.submenu ? cmd.submenu : 'undefined'}`);

//     console.log(`Info: submenus[cmd.submenu] = ${submenus[cmd.submenu] ? submenus[cmd.submenu] : 'undefined'}`);

//     if (cmd.submenu && submenus[cmd.submenu]) {
//         // Use the submenu name directly as the menuId
//         menuId = `torn-focus-ui.${cmd.submenu}`;
//     }


//     if (menuId) {
//         menus[menuId] = menus[menuId] || [];

//         // Initialize counter for each submenu
//         if (!menus[menuId]._submenuOrder) {
//             menus[menuId]._submenuOrder = 1;
//         }

//         menus[menuId].push({
//             group: cmd.menu ? cmd.menu.group : `${cmd.submenu}@${menus[menuId]._submenuOrder}`,
//             command: `torn-focus-ui.${commandName}`
//         });

//         //- Increment the counter --------------------
//         menus[menuId]._submenuOrder++;
//     }
// }







// //- Add submenus to their parent menus -------
// for (const submenuName in submenus) { // Use submenuName directly
//     const submenu = submenus[submenuName];
//     const parentMenu = submenu.location;

//     menus[parentMenu] = menus[parentMenu] || [];
//     menus[parentMenu].push({
//         group: submenu.group,
//         // Use submenuName directly here
//         submenu: `torn-focus-ui.${submenuName}`
//     });

//     //- Add submenu to package.json --------------
//     packageJson.contributes.submenus.push({
//         label: submenu.label,
//         // Use submenuName directly here as well
//         id: `torn-focus-ui.${submenuName}`
//     });
// }











// trial phrase to do || trialPhraseToDo

// trialPhraseToDo||TrialPhraseToDo            Ctrl_T+Ctrl_(C) amel case
// trial phrase to do || trial-phrase-to-do    Ctrl_T+Ctrl_(K) ebob case
// trial phrase to do || trialphrasetodo       Ctrl_T+Ctrl_(L) ower case
// TrialPhraseToDo||TrialPhraseToDo            Ctrl_T+Ctrl_(P) ascal case
// trial phrase to do || trial_phrase_to_do    Ctrl_T+Ctrl_(S) nake case
// Trial Phrase To Do || Trialphrasetodo       Ctrl_T+Ctrl_(T) itle case
// TRIAL PHRASE TO DO || TRIALPHRASETODO       Ctrl_T+Ctrl_(U) pper case
