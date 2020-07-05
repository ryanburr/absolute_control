/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import * as path from 'path';
import * as fs from 'fs';

import { readFiles } from './readFiles';
import { readFolders } from './readFolders';

export async function sortByGenre(source: string, dest: string) {
    const mp3Files = await readFiles(source);
    let genreFolders = await readFolders(dest);

    for (let i = 0; i < mp3Files.length; i++) {
        const sourceMp3 = mp3Files[i];
        const fileName = sourceMp3.path.split('\\')[sourceMp3.path.split('\\').length - 1];
        const { genre } = sourceMp3.mp3.common;

        console.log(`\nsource_file: ${fileName}, genre: ${genre}`);

        if (!genre?.length) {
            console.warn('Cannot sort song: empty genre');
            continue;
        }

        const sourceGenre = genre[0].replace('/', '&');
        const foundGenre = Object.keys(genreFolders).find(x => isStringEqual(x, sourceGenre));

        if (foundGenre) {
            console.log(`==> Source genre found: ${foundGenre}`);

            const existingMp3s = genreFolders[foundGenre];
            const sourceData = sourceMp3.mp3.common;

            const doesFileExist = existingMp3s.some(x => {
                const target = x.mp3.common;
                return (
                    isStringEqual(sourceData.artist, target.artist) &&
                    isStringEqual(sourceData.title, target.title)
                );
            });

            if (doesFileExist) {
                console.warn(`==> Song ${sourceData.title} already exists... Skipping`);
            } else {
                const genreFolder = path.join(dest, foundGenre);
                const finalPath = path.join(genreFolder, fileName);

                console.log(`==> Copying to dest folder: ${genreFolder}`);

                fs.copyFileSync(sourceMp3.path, finalPath);
                fs.unlinkSync(sourceMp3.path);
            }
        } else {
            if (!sourceGenre) {
                console.warn('==> Cannot sort song: empty genre');
                continue;
            }

            console.log('==> Creating genre folder...');

            // make folder
            const newGenrePath = path.join(dest, sourceGenre);
            fs.mkdirSync(newGenrePath);

            // move file
            const finalPath = path.join(newGenrePath, fileName);
            console.log(`==> Copying to dest folder: ${newGenrePath}`);
            fs.copyFileSync(sourceMp3.path, finalPath);
            fs.unlinkSync(sourceMp3.path);
            // fs.rmdirSync(sourceMp3.path);

            // reload genre folders after adding new folder
            genreFolders = await readFolders(dest);
        }
    }
}

function isStringEqual(a: string | null | undefined, b: string | null | undefined): boolean {
    return !!a && !!b && a.toLocaleLowerCase().trim() === b.toLocaleLowerCase().trim();
}
