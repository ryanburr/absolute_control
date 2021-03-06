import * as path from 'path';
import * as fs from 'fs';
import electron from 'electron';
import { PathLike } from 'original-fs';

interface SettingOptions {
    configName: string;
}

export class Settings {
    private path: string;

    private data: Record<string, unknown>;

    constructor(opts: SettingOptions) {
        // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
        // app.getPath('userData') will return a string of the user's app data directory path.
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
        this.path = path.join(userDataPath, `${opts.configName}.json`);

        this.data = parseDataFile(this.path);
    }

    // This will just return the property on the `data` object
    public get<T>(key: string): T {
        return this.data[key] as T;
    }

    // ...and this will set it
    public set(key: string, val: unknown) {
        this.data[key] = val;
        // Wait, I thought using the node.js' synchronous APIs was bad form?
        // We're not writing a server so there's not nearly the same IO demand on the process
        // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
        // we might lose that data. Note that in a real app, we would try/catch this.
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
}

function parseDataFile(filePath: PathLike, defaults = {}) {
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
        return JSON.parse(fs.readFileSync(filePath).toString());
    } catch (error) {
        // if there was some kind of error, return the passed in defaults instead.
        return defaults;
    }
}

const spotifySettings = new Settings({
    configName: 'spotify_auth'
});

const pathSettings = new Settings({
    configName: 'paths'
});

export { spotifySettings, pathSettings };
