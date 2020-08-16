/* eslint-disable class-methods-use-this */
import * as querystring from 'querystring';
import { remote } from 'electron';
import { assert } from 'console';
import SpotifyWebApi from 'spotify-web-api-node';
import { spotifySettings } from '../utils/settings';

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

assert(!!SPOTIFY_CLIENT_ID);
assert(!!SPOTIFY_CLIENT_SECRET);

export class SpotifyClient {
    private spotifyApi: SpotifyWebApi;

    public accessToken: string | undefined;

    constructor() {
        console.log('initializing spotify client');

        const access_token = spotifySettings.get<string>('access_token');
        const expires_in = spotifySettings.get<number>('expires_in');
        const refresh_token = spotifySettings.get<string>('refresh_token');

        this.spotifyApi = new SpotifyWebApi({
            clientId: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
            redirectUri: 'https://casaburr.com',
            accessToken: access_token,
            refreshToken: refresh_token
        });

        this.accessToken = access_token;

        if (access_token) {
            this.spotifyApi.setAccessToken(access_token);
        }
    }

    public async getSavedTracks() {
        try {
            const result = await this.spotifyApi.getMySavedTracks({
                limit: 50,
                offset: 0
            });

            return result.body.items;
        } catch (err) {
            if (err.statusCode === 401) {
                this.setAuthData({});
            }
            console.error('Spotify error:', err.message);
            throw err;
        }
    }

    public async refreshToken() {
        try {
            const data = await this.spotifyApi.refreshAccessToken();
            this.setAuthData(data.body);
        } catch (err) {
            console.error('Failed to refresh access token');
            throw err;
        }
    }

    public async promptLogin(): Promise<void> {
        try {
            const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
                scope: 'user-library-read',
                state: 'test',
                show_dialog: true,
                response_type: 'token',
                redirect_uri: 'https://casaburr.com',
                client_id: SPOTIFY_CLIENT_ID
            })}`;

            const body = await new Promise<string>((resolve, reject) => {
                let params: any;
                const authWindow = new remote.BrowserWindow({
                    width: 800,
                    height: 600,
                    show: false
                    // 'node-integration': false,
                    // 'web-security': false
                });
                // 'will-navigate' is an event emitted when the window.location changes
                // newUrl should contain the tokens you need
                // authWindow.webContents.on('will-navigate', (event, newUrl) => {
                //     console.log(newUrl);
                //     params = querystring.parse(newUrl.split('?')[1]);
                //     this.setAuthData(newUrl);
                //     authWindow.close();
                // });
                // authWindow.webContents.on(
                //     'did-redirect-navigation',
                //     (event: any, newUrl: string) => {
                //         params = querystring.parse(newUrl.split('#')[1]);
                //         if (params.access_token) {
                //             this.setAuthData(params);
                //         }
                //         authWindow.close();
                //     }
                // );
                // authWindow.webContents.on('did-navigate-in-page', (event: any, newUrl: string) => {
                //     params = querystring.parse(newUrl.split('#')[1]);
                //         if (params.access_token) {
                //             this.setAuthData(params);
                //         }
                //         authWindow.close();
                // });
                authWindow.webContents.on('did-frame-navigate', (event: any, newUrl: string) => {
                    params = querystring.parse(newUrl.split('#')[1]);
                    if (params.access_token) {
                        // this.setAuthData(params);
                        authWindow.close();
                    }
                });
                authWindow.on('closed', () => {
                    // authWindow = undefined;
                    resolve(params);
                });

                authWindow.loadURL(authUrl);
                authWindow.show();
            });

            console.log(body);

            this.setAuthData(body);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    private setAuthData(data: any) {
        console.log(data);

        const { access_token, expires_in, refresh_token } = data;

        console.log(`The token expires in ${expires_in}`);
        console.log(`The access token is ${access_token}`);
        console.log(`The refresh token is ${refresh_token}`);

        spotifySettings.set('access_token', access_token);
        spotifySettings.set('expires_in', expires_in);
        spotifySettings.set('refresh_token', refresh_token);

        this.accessToken = access_token;

        // Set the access token on the API object to use it in later calls
        this.spotifyApi.setAccessToken(access_token);
        this.spotifyApi.setRefreshToken(refresh_token);
    }
}
