import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { SpotifyAuthContext } from './SpotifyAuthContext';
import { SpotifyClient } from '../../clients/spotify';

const SpotifyProvider = (props: { children: React.ReactChild }) => {
    const client = React.useMemo(() => new SpotifyClient(), []);

    return (
        <SpotifyAuthContext.Provider value={client}>{props.children}</SpotifyAuthContext.Provider>
    );
};

export default hot(SpotifyProvider);
