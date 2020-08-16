import * as path from 'path';
import { pathSettings } from './utils/settings';

export const rootDir = () => path.join(pathSettings.get('root_music_path') ?? '');
export const needsDefinitionPath = () => {
    const root = rootDir();
    return root ? path.join(root, pathSettings.get('definition_folder') || 'Needs Definition') : '';
};
export const inconclusivePath = () => {
    const root = rootDir();
    return root
        ? path.join(root, pathSettings.get('inconclusive_folder') || 'Cannot Find Data')
        : '';
};
export const needsSortingPath = () => {
    const root = rootDir();
    return root ? path.join(root, pathSettings.get('sort_folder') || 'Need to Sort') : '';
};
export const genresPath = () => {
    const root = rootDir();
    return root ? path.join(root, pathSettings.get('genre_folder') || 'Genre') : '';
};
