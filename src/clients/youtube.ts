import * as querystring from 'querystring';
import { YoutubeSearchResult } from '../contracts/YoutubeSearchResult';

const { ABSOLUTE_API } = process.env;

export const youtubeClient = {
    search: async (query: string) => {
        try {
            const response = await fetch(
                `${ABSOLUTE_API}/youtube/search?${querystring.stringify({ query })}`
            );
            return (await response.json()) as YoutubeSearchResult[];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    get: async (v: string, name: string) => {
        try {
            const response = await fetch(
                `${ABSOLUTE_API}/youtube/watch?${querystring.stringify({
                    v,
                    name
                })}`
            );
            return (await response.json()) as any;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};
