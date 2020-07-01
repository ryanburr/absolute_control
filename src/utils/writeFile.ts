import ffmetadata from 'ffmetadata';
import { Mp3File } from '../contracts/Mp3File';
import { SongDetailResult } from '../contracts/SongDetailResult';

export function writeFile(mp3File: Mp3File, metadata: SongDetailResult) {
    return new Promise<void>((resolve, reject) => {
        ffmetadata.write(
            mp3File.path,
            {
                artist: metadata.artists,
                title: `${metadata.title}${metadata.remix ? `- ${metadata.remix}` : ''}`,
                genre: metadata.genre,
                date: metadata.releaseDate,
                publisher: metadata.labels,
                album: metadata.album
            },
            (err: Error) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            }
        );
    });
}
