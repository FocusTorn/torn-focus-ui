const fs = require('fs');

const packageJsonPath = './package.json';

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const commandsJsonPath = 'src/extension/commands/_commands.json';
const commandsJson = fs.readFileSync(commandsJsonPath, 'utf-8');
const jsonCommentsRegex = /\/\*[\s\S]*?\*\/|\/\/.*/g;
const commandsJsonWithoutComments = commandsJson.replace(jsonCommentsRegex, '');
const commandsData = JSON.parse(commandsJsonWithoutComments);

const commands = commandsData;
delete commands.submenus;

/**
 * Generates an array of command objects for the package.json "contributes.commands" section.
 * It iterates through the provided commands object, skipping submenus, and creates
 * a command entry for each regular command.
 *
 * @param {Object} commands An object containing command definitions.
 * @returns {Array<Object>} An array of command objects suitable for package.json.
 */
function generateCommandsArray(commands) {
    return Object.entries(commands)
        .map(([commandKey, cmd]) => {
            // Ignore objects that are submenus
            if (commandKey.endsWith('Submenu')) {
                return null; // Skip submenus
            }

            return {
                title: `FT-UI: ${cmd.group ? cmd.group + ' > ' : ''}${cmd.name}`,
                command: `torn-focus-ui.${cmd.command || commandKey}`,
            };
        })
        .filter((command) => command !== null); // Remove null entries (submenus)
}

/**
 * Reads language icon data from a module and formats it for package.json.
 *
 * @param {string} languagesModulePath - Path to the language icons module.
 * @param {string} iconPath - Base path for icon files.
 * @returns {Array<Object>} - Formatted language icon data.
 */
function generateLanguagesArray(languagesModulePath, iconPath) {
    const languagesModule = require(languagesModulePath);
    const languages = languagesModule.languages;

    return languages.icons.map((lang) => ({
        id: lang.id,
        icon: {
            light: `${iconPath}${lang.icon}`,
            dark: `${iconPath}${lang.icon}`,
        },
    }));
}

/**
 * Adds a submenu definition to the package.json "contributes.submenus" section
 * and returns a menu entry object that references the newly added submenu.
 *
 * @param {Object} submenu The submenu object to be added.
 * @param {string} submenuName The key of the submenu in the commands object.
 * @returns {Object} A menu entry object referencing the added submenu.
 */
function addSubmenu(submenu, submenuName) {
    // Add submenu to package.json
    packageJson.contributes.submenus.push({
        label: submenu.label,
        id: `torn-focus-ui.${submenuName}`,
    });

    return {
        group: submenu.group,
        submenu: `torn-focus-ui.${submenuName}`,
    };
}

/**
 * Adds a regular command to the specified menus object, organizing it
 * under the appropriate menu ID and group.
 *
 * @param {Object} cmd The command object to add.
 * @param {Object} menus The menus object to modify.
 * @param {string} key The key of the command in the original commands object.
 */
function addCommandToMenu(cmd, menus, key) {
    let menuId = cmd.menu ? cmd.menu.name : null;

    if (cmd.submenu && commands[cmd.submenu]) {
        menuId = `torn-focus-ui.${cmd.submenu}`;
    }

    if (menuId) {
        menus[menuId] = menus[menuId] || [];

        let group = cmd.menu ? cmd.menu.group : `${cmd.submenu}@`;
        group = cmd.subgroup !== undefined ? `${cmd.submenu}${cmd.subgroup}@1` : `${group}1`;

        menus[menuId].push({
            group: group,
            command: `torn-focus-ui.${cmd.command || key}`,
        });
    }
}

/**
 * Generates the "contributes.menus" object for the package.json,
 * defining the structure and commands within each menu.
 *
 * @param {Object} commands The object containing all command definitions.
 * @returns {Object} The generated menus object for package.json.
 */
function generateMenusObject(commands) {
    const menus = {};
    packageJson.contributes.menus = {};
    packageJson.contributes.submenus = [];

    for (const [key, cmd] of Object.entries(commands)) {
        if (key.endsWith('Submenu')) {
            const menuEntry = addSubmenu(cmd, key);
            menus[cmd.location] = menus[cmd.location] || [];
            menus[cmd.location].push(menuEntry);
        } else {
            addCommandToMenu(cmd, menus, key); // Pass key to the function
        }
    }
    return menus;
}

const formattedLanguages = generateLanguagesArray('../../dict/language_icons.model.js', './assets/icons/file_icons/');

packageJson.contributes.commands = generateCommandsArray(commands);
packageJson.contributes.menus = generateMenusObject(commands);
packageJson.contributes.languages = formattedLanguages;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
