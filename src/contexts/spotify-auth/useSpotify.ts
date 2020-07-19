import React from 'react';
import { SpotifyAuthContext } from './SpotifyAuthContext';

export function useSpotify() {
    const client = React.useContext(SpotifyAuthContext);
    if (!client) {
        throw new Error('SpotifyAuthContext not provided');
    }

    return client;
}
