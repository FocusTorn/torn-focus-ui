import * as path from 'path';

import { getWorkspaceRoot } from './../../helpers/pathing';

if (getWorkspaceRoot) {
    const SOMEPATH = path.join(getWorkspaceRoot, 'src', 'myFile.txt');
    console.log(SOMEPATH);

} else {
    console.error("Could not determine workspace root.");
}
