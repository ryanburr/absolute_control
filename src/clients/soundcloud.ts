import * as querystring from 'querystring';
import { SoundcloudSearchResult } from '../contracts/SoundcloudSearchResult';

const { ABSOLUTE_API } = process.env;

export const soundcloudClient = {
    search: async (query: string) => {
        try {
            const response = await fetch(
                `${ABSOLUTE_API}/soundcloud/search?${querystring.stringify({ query })}`
            );
            return (await response.json()) as SoundcloudSearchResult[];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    get: async (uri: string, name: string) => {
        try {
            const response = await fetch(
                `${ABSOLUTE_API}/soundcloud/download?${querystring.stringify({
                    uri,
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
