import * as path from 'path';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { Typography, ThemeProvider, createMuiTheme, Tabs } from '@material-ui/core';
import NeedsDefinition from '../routes/NeedsDefinition';
import AbsTabs from './abs/AbsTabs';
import AbsTab from './abs/AbsTab';
import AbsTabPanel from './abs/AbsTabPanel';
import NeedsSorting from '../routes/NeedsSorting';
import Genres from '../routes/Genres';
import Search from '../routes/Search';
import SpotifyProvider from '../../contexts/spotify-auth/SpotifyProvider';

const absoluteTheme = createMuiTheme();

const Application = () => {
    const [tab, setTab] = React.useState(0);

    return (
        <ThemeProvider theme={absoluteTheme}>
            <div>
                <Typography variant="h1">Absolute Control!</Typography>
                <AbsTabs value={tab} onChange={handleChange}>
                    <AbsTab label="Search" />
                    <AbsTab label="Need to Define" />
                    <AbsTab label="Need to Sort" />
                    <AbsTab label="Genres" />
                </AbsTabs>
                <AbsTabPanel value={tab} index={0}>
                    <SpotifyProvider>
                        <Search />
                    </SpotifyProvider>
                </AbsTabPanel>
                <AbsTabPanel value={tab} index={1}>
                    <NeedsDefinition />
                </AbsTabPanel>
                <AbsTabPanel value={tab} index={2}>
                    <NeedsSorting />
                </AbsTabPanel>
                <AbsTabPanel value={tab} index={3}>
                    <Genres />
                </AbsTabPanel>
            </div>
        </ThemeProvider>
    );

    function handleChange(e: any, v?: any) {
        setTab(v);
    }
};

export default hot(Application);
