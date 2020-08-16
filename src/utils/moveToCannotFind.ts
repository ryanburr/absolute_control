import * as fs from 'fs';
import * as path from 'path';

import { Mp3File } from '../contracts/Mp3File';
import { inconclusivePath } from '../constants';

export function moveToCannotFind(file: Mp3File): void {
    const fileName = path.basename(file.path);
    fs.copyFileSync(file.path, path.join(inconclusivePath(), fileName));
    fs.unlinkSync(file.path);
}
