import React from 'react';
import { SpotifyClient } from '../../clients/spotify';

export const SpotifyAuthContext = React.createContext<SpotifyClient | undefined>(undefined);
