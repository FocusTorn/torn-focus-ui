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

class MenuSection {
  constructor(baseGroup) {
    this.baseGroup = baseGroup;
    this.groupNumber = 1;
    this.order = 0;
  }

  nextGroup() {
    this.groupNumber++;
    this.order = 0;
  }

  generateGroup() {
    return `${this.baseGroup}${this.groupNumber}@${this.order++}`;
  }
}

class SubmenuSection extends MenuSection {
  constructor(submenu, submenuName) {
    super(submenu.group);
    this.submenu = submenu;
    this.submenuName = submenuName;
  }

  addToPackageJson(packageJson) {
    packageJson.contributes.submenus.push({
      label: this.submenu.label,
      id: `torn-focus-ui.${this.submenuName}`,
    });
  }

  generateMenuEntry() {
    return {
      group: this.generateGroup(),
      submenu: `torn-focus-ui.${this.submenuName}`,
    };
  }
}

class CommandSection {
  constructor(commands) {
    this.commands = commands;
  }

  generateCommandsArray() {
    return Object.entries(this.commands)
      .map(([commandKey, cmd]) => {
        if (commandKey.endsWith('Submenu')) {
          return null;
        }
        return {
          title: `FT-UI: ${cmd.group ? cmd.group + ' > ' : ''}${cmd.name}`,
          command: `torn-focus-ui.${cmd.command || commandKey}`,
        };
      })
      .filter((command) => command !== null);
  }
}

class MenuGenerator {
  constructor(commands) {
    this.commands = commands;
    this.menus = {};
    this.menuSections = {};
  }

  getSubmenuSection(submenu, submenuName) {
    return new SubmenuSection(submenu, submenuName);
  }

  getCommandSection() {
    return new CommandSection(this.commands);
  }

  getMenuSection(baseGroup) {
    if (!this.menuSections[baseGroup]) {
      this.menuSections[baseGroup] = new MenuSection(baseGroup);
    }
    return this.menuSections[baseGroup];
  }

  addCommandToMenu(cmd, menuId, key) {
    const baseGroup = cmd.menu ? cmd.menu.group : `${cmd.submenu}`;
    const menuSection = this.getMenuSection(baseGroup);

    this.menus[menuId] = this.menus[menuId] || [];
    this.menus[menuId].push({
      group: menuSection.generateGroup(),
      command: `torn-focus-ui.${cmd.command || key}`,
    });

    if (cmd.dividerAfter) {
      menuSection.nextGroup();
    }
  }

  generateMenusObject() {
    packageJson.contributes.menus = {};
    packageJson.contributes.submenus = [];

    for (const [key, cmd] of Object.entries(this.commands)) {
      if (key.endsWith('Submenu')) {
        const submenuSection = this.getSubmenuSection(cmd, key);
        submenuSection.addToPackageJson(packageJson);
        const menuEntry = submenuSection.generateMenuEntry();
        this.menus[cmd.location] = this.menus[cmd.location] || [];
        this.menus[cmd.location].push(menuEntry);
      } else {
        let menuId = cmd.menu ? cmd.menu.name : null;
        if (cmd.submenu && commands[cmd.submenu]) {
          menuId = `torn-focus-ui.${cmd.submenu}`;
        }
        this.addCommandToMenu(cmd, menuId, key);
      }
    }
    return this.menus;
  }
}

class LanguagesSection {
  constructor(languagesModulePath, iconPath) {
    this.languagesModulePath = languagesModulePath;
    this.iconPath = iconPath;
  }

  generateLanguagesArray() {
    const languagesModule = require(this.languagesModulePath);
    const languages = languagesModule.languages;

    return languages.icons.map((lang) => ({
      id: lang.id,
      icon: {
        light: `${this.iconPath}${lang.icon}`,
        dark: `${this.iconPath}${lang.icon}`,
      },
    }));
  }
}

// Usage:
const menuGenerator = new MenuGenerator(commands);
const commandSection = menuGenerator.getCommandSection();
const languagesSection = new LanguagesSection('../../dict/language_icons.model.js', './assets/icons/file_icons/');

packageJson.contributes.commands = commandSection.generateCommandsArray();
packageJson.contributes.menus = menuGenerator.generateMenusObject();
packageJson.contributes.languages = languagesSection.generateLanguagesArray();

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
