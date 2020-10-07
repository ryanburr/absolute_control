# Absolute Control

A music management application to help maintain and grow you music library.

## Pre-reqs

To build and run this app locally you will need a few things:

1. Install [Node.js](https://nodejs.org/en/).
1. Install [VS Code](https://code.visualstudio.com/) or use an editor of your choice.
1. Install the [GitHub CLI](https://cli.github.com/).
1. Authenticate with GitHub with the following command.
    ```
    gh auth login
    ```
1. Fork the repository with the following command.
    ```
    gh repo fork ryanburr/absolute_control --clone=true --remote=true
    ```
1. Navigate to the project root.
    ```
    cd absolute_control
    ```
1. Install npm dependencies.
    ```
    npm install
    ```
1. Create a `.env` file in the root directory of this repository and add the following environment variables.
    ```
    ABSOLUTE_API=http://localhost:3000
    SPOTIFY_CLIENT_ID=<your-spotify-client-id>
    SPOTIFY_CLIENT_SECRET=<your-spotify-client-secret>
    ```
    **ABSOLUTE_API** - the endpoint running the [`absolute_cmd`](https://github.com/ryanburr/absolute_cmd) api.
    **SPOTIFY_CLIENT_ID** - the client id of a Spotify app. If you do not have one, you can create one [here](https://developer.spotify.com/dashboard/applications)
    **SPOTIFY_CLIENT_SECRET** - the client secret of the Spotify app mentioned above.

## Usage

Run the application.

```bash
npm run start-dev
```

Once running, you will need to go to the settings page and configure a few things.

## Packaging

This uses [Electron builder](https://www.electron.build/) to build and package the application. By default you can run the following to package for your current platform:

```bash
npm run dist
```

This will create a installer for your platform in the `releases` folder.

You can make builds for specific platforms (or multiple platforms) by using the options found [here](https://www.electron.build/cli). E.g. building for all platforms (Windows, Mac, Linux):

```bash
npm run dist -- -mwl
```
