var fileIcons = {
    file: { name: "file" },
    icons: [
        { name: "ahk",          fileExtensions: ["ahk"],                    },
        { name: "ahk-alt",      fileExtensions: ["ah2"],                    },
        { name: "bun-lock",     fileNames:      ["bun.lockb"],              },
        { name: "bun-config",   fileNames:      ["bunfig.toml"],            },
        { name: "c",            fileExtensions: ["c"],                      },
        { name: 'changelog',    fileNames: [
                                    "changelog",
                                    "changelog.md",
                                    "changelog.rst",
                                    "changelog.txt",
                                    "changes",
                                    "changes.md",
                                    "changes.rst",
                                    "changes.txt",
                                    ],
                                                                            },


        { name: "coderabbit",   fileNames:      [".coderabbit.yaml"],       },
        { name: "console",      fileExtensions: ["bash"],                   },
        { name: "cpp",          fileExtensions: ["cpp"],                    },
        { name: "cs",           fileExtensions: ["cs"],                     },
        { name: "editorconfig", fileNames:      [".editorconfig"],          },
        { name: "eslint",       fileNames:      [".eslintrc.json"],         },
        { name: "git",          fileNames:      [".gitattributes"],         },
        { name: "git-ignore",   fileNames:      [".gitignore"],             },
        { name: 'gulp',         fileNames:      [
                                    "gulpfile.js",
                                    "gulpfile.js",
                                    "gulpfile.mjs",
                                    "gulpfile.ts",
                                    "gulpfile.cts",
                                    "gulpfile.mts",
                                    "gulpfile.babel.js",
                                ],
                                                                            },
        { name: "image",        fileExtensions: [
                                    "jpg",
                                    "gif",
                                    "png"
                                ],                                          },
        { name: "json",         fileExtensions: ["json"],                   },
        { name: "javascript",   fileExtensions: [
                                    "js",
                                    "mjs"
                                ],
        },
        { name: "julia",        fileExtensions: ["jl"],                     },
        { name: "license",      fileNames: [
                                    "license.txt",
                                    "license.md"
                                ],
        },
        { name: "markdown",     fileExtensions: ["md"],                     },
        { name: "model",        fileExtensions: ["model.js"],               },
        { name: "node-ignore",  fileNames:      [".npmignore"],             },
        { name: "package",      fileNames:      ["package.json"],           },
        { name: "package-lock", fileNames:      ["package-lock.json"],      },
        { name: "palm-config",  fileNames:      ["pyvenv.cfg"],             },
        { name: "poetry",       fileNames:      ["poetry.p"],               },
        { name: "poetry-lock",  fileNames:      ["poetry.lock"],            },
        { name: "powershell",   fileExtensions: [
                                    "ps1",
                                    "psm1",
                                    "psd1",
                                    "ps1xml",
                                    "psc1",
                                    "pssc"
                                ],
                                                                            },
        { name: "python",       fileExtensions: ["py"],                     },
        { name: "python-misc",  fileNames: [
                                    ".python-version",
                                    "requirements.txt",
                                    "pipfile",
                                    "manifest.in",
                                    "pylintrc",
                                    "pyproject.toml",
                                    "py.typed",
                                ],
                                fileExtensions: [
                                    "pyc",
                                    "whl"
                                ],
                                                                            },
        { name: "readme",       fileNames: ["readme.md"],                   },
        { name: "shell",        fileExtensions: ["sh"],                     },
        { name: "svg",          fileExtensions: ["svg"],                    },
        { name: "typescript",   fileExtensions: ["ts"],                     },
        { name: "tsconfig",     fileNames: ["tsconfig.json"],               },
        { name: "textfile",     fileExtensions: ["txt"],                    },
        { name: "yaml",         fileExtensions: ["yaml"],                   },
        { name: "vscode",       fileNames: [
                                    "vsc-extension-quickstart.md"
                                ],
                                fileExtensions: [
                                    "vsix",
                                    "code-workspace"
                                ],
        },
        { name: "vscode-ignore",fileNames: [".vscodeignore"],               },
        { name: "zip",          fileExtensions: [
                                    "zip",
                                    "tar",
                                    "7z",
                                    "rar",
                                ],
                                                                            },
    ],
};

module.exports = fileIcons;
