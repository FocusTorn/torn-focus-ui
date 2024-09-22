import { join } from 'node:path';
import { build } from 'esbuild'; 
import config from './esbuild.config';
import * as fs from 'fs/promises'; 

const output = await build(config).catch(() => process.exit(1));

// If metafile is enabled, write it to dist/metafile.json
// Metafiles can be analyzed to determine the dependencies of the build
// https://esbuild.github.io/analyze/


if (config.metafile) {
    const path = join(process.cwd(), 'dist', 'metafile.json');
    await fs.writeFile(path, JSON.stringify(output.metafile, undefined, 2));
}
