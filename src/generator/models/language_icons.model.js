//cspell:disable

const languages = {
    icons: [
        {
            "id": "ahk",
            "icon": "./assets/icons/file_icons/ahk.svg"
        },
        {
            "id": "bat",
            "icon": "./assets/icons/file_icons/terminal.svg"
        },
        {
            "id": "c",
            "icon": "./assets/icons/file_icons/c.svg"
        },
        // ... your other language icons
    ]
};

module.exports = { languages };



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
// {
//     "id": "code-text-binary",
//     "icon": {
//         "light": "./assets/icons/file_icons/binary.svg",
//         "dark": "./assets/icons/file_icons/binary.svg"
//     }
// },
// {
//     "id": "coffeescript",
//     "icon": {
//         "light": "./assets/icons/file_icons/coffee.svg",
//         "dark": "./assets/icons/file_icons/coffee.svg"
//     }
// },
// {
//     "id": "cpp",
//     "icon": {
//         "light": "./assets/icons/file_icons/cpp.svg",
//         "dark": "./assets/icons/file_icons/cpp.svg"
//     }
// },
// {
//     "id": "css",
//     "icon": {
//         "light": "./assets/icons/file_icons/css.svg",
//         "dark": "./assets/icons/file_icons/css.svg"
//     }
// },
// {
//     "id": "dockercompose",
//     "icon": {
//         "light": "./assets/icons/file_icons/docker.svg",
//         "dark": "./assets/icons/file_icons/docker.svg"
//     }
// },
// {
//     "id": "dockerfile",
//     "icon": {
//         "light": "./assets/icons/file_icons/docker.svg",
//         "dark": "./assets/icons/file_icons/docker.svg"
//     }
// },
// {
//     "id": "git-commit",
//     "icon": {
//         "light": "./assets/icons/file_icons/git.svg",
//         "dark": "./assets/icons/file_icons/git.svg"
//     }
// },
// {
//     "id": "git-rebase",
//     "icon": {
//         "light": "./assets/icons/file_icons/git.svg",
//         "dark": "./assets/icons/file_icons/git.svg"
//     }
// },
// {
//     "id": "javascript",
//     "icon": {
//         "light": "./assets/icons/file_icons/javascript.svg",
//         "dark": "./assets/icons/file_icons/javascript.svg"
//     }
// },
// {
//     "id": "json",
//     "icon": {
//         "light": "./assets/icons/file_icons/json.svg",
//         "dark": "./assets/icons/file_icons/json.svg"
//     }
// },
// {
//     "id": "jsonl",
//     "icon": {
//         "light": "./assets/icons/file_icons/json.svg",
//         "dark": "./assets/icons/file_icons/json.svg"
//     }
// },
// {
//     "id": "jsonc",
//     "icon": {
//         "light": "./assets/icons/file_icons/json.svg",
//         "dark": "./assets/icons/file_icons/json.svg"
//     }
// },
// {
//     "id": "julia",
//     "icon": {
//         "light": "./assets/icons/file_icons/julia.svg",
//         "dark": "./assets/icons/file_icons/julia.svg"
//     }
// },
// {
//     "id": "shellscript",
//     "icon": {
//         "light": "./assets/icons/file_icons/shell.svg",
//         "dark": "./assets/icons/file_icons/shell.svg"
//     }
// },
// {
//     "id": "typescript",
//     "icon": {
//         "light": "./assets/icons/file_icons/typescript.svg",
//         "dark": "./assets/icons/file_icons/typescript.svg"
//     }
// },
// {
//     "id": "txtc",
//     "icon": {
//         "light": "./assets/icons/file_icons/text-file.svg",
//         "dark": "./assets/icons/file_icons/text-file.svg"
//     }
// },
// {
//     "id": "cpp",
//     "icon": {
//         "light": "./assets/icons/file_icons/cpp.svg",
//         "dark": "./assets/icons/file_icons/cpp.svg"
//     }
// },
// {
//     "id": "yaml",
//     "icon": {
//         "light": "./assets/icons/file_icons/yaml.svg",
//         "dark": "./assets/icons/file_icons/yaml.svg"
//     }
// }
