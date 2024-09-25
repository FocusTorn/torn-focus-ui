import * as path from 'path';
import * as fs from 'fs';
import { Uri } from 'vscode';

/**
 *
 *
 *
 * Retrieves icon options from a directory.
 *
 * This function reads the contents of the specified directory and filters for SVG files.
 * It can optionally apply an additional filter to further refine the list of files.
 * For each SVG file, it extracts the icon name from the filename and creates an icon option
 * object containing the label (icon name) and an optional icon path.
 *
 * @param directoryPath - The path to the directory containing icon SVG files.
 * @param additionalFilter - An optional filter function to apply to the file list.
 * @returns An array of icon options, each with a label and an optional icon path.
 */
export function getIconOptionsFromDirectory(
    directoryPath: string,
    additionalFilter?: (file: string) => boolean
): { label: string; description?: string; iconPath?: Uri }[] {
    const iconFiles = fs.readdirSync(directoryPath);

    return iconFiles
        .filter((file) => path.extname(file).toLowerCase() === '.svg')
        .filter((file) => (additionalFilter ? additionalFilter(file) : true))
        .map((file) => ({
            label: path
                .basename(file, '.svg')
                .replace(/^_/, '')
                .replace(/^folder-/, ''),
            iconPath: Uri.file(path.join(directoryPath, file)),
        }));
}
