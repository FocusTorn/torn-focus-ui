const fs = require('fs');
const path = require('path');

const { transformIcons } = require('../core/generator/js/create_file_json4'); // Assuming your script is in create_file_json4.js

// Mock data for testing
const mockFileIconsData = {
    file: { name: "file" },
    icons: [
        { name: "test-icon", fileExtensions: ["test"] },
        { name: "duplicate-icon", fileExtensions: ["dup"] },
        { name: "duplicate-icon", fileNames: ["dup_file"] } // Duplicate name
    ]
};

const mockFolderIconsData = {
    folder: { name: "basic" },
    rootFolder: { name: "root" },
    icons: [
        { name: "test-folder", folderNames: ["test-folder"] },
        { name: "another-duplicate", folderNames: ["another-dup"] },
        { name: "another-duplicate", folderNames: ["another-dup2"] } // Duplicate name
    ]
};

describe('transformIcons', () => {
    it('should detect and warn about duplicate icon names', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn');
        transformIcons(mockFileIconsData, mockFolderIconsData);

        expect(consoleWarnSpy).toHaveBeenCalledWith('Warning: Duplicate file icon name found:', 'duplicate-icon');
        expect(consoleWarnSpy).toHaveBeenCalledWith('Warning: Duplicate folder icon name found:', 'another-duplicate');

        consoleWarnSpy.mockRestore(); // Restore the original console.warn
    });
});
