import * as path from 'path';

export function getFileName(filePath: string): string {
    const parts = path.basename(filePath).split('.');
    return parts.slice(0, parts.length - 1).join('.');
}
