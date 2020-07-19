import * as querystring from 'querystring';
import { BeatportSearchResult } from '../contracts/BeatportSearchResults';
import { SongDetailResult } from '../contracts/SongDetailResult';

const { ABSOLUTE_API } = process.env;

export const beatportClient = {
    search: async (query: string) => {
        try {
            const response = await fetch(
                `${ABSOLUTE_API}/beatport/search?${querystring.stringify({ query })}`
            );
            return (await response.json()) as BeatportSearchResult[];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    get: async (url: string) => {
        try {
            const response = await fetch(`${ABSOLUTE_API}/beatport${url}`);
            return (await response.json()) as SongDetailResult;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};
