import * as fs from 'fs';
import * as path from 'path';

import { Mp3File } from '../contracts/Mp3File';
import { needsSortingPath } from '../constants';

export function moveToNeedsSort(file: Mp3File): void {
    const fileName = path.basename(file.path);
    fs.copyFileSync(file.path, path.join(needsSortingPath, fileName));
    fs.unlinkSync(file.path);
}
