import * as querystring from 'querystring';
import { SearchResult } from '../contracts/SearchResults';
import { SongDetailResult } from '../contracts/SongDetailResult';

const { BEATPORT_API } = process.env;

export const beatportClient = {
    search: async (query: string) => {
        try {
            const response = await fetch(
                `http://localhost:3000/search?${querystring.stringify({ query })}`
            );
            return (await response.json()) as SearchResult[];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    get: async (url: string) => {
        try {
            const response = await fetch(`http://localhost:3000${url}`);
            return (await response.json()) as SongDetailResult;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};
