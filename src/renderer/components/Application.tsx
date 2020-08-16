import * as path from 'path';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import {
    Typography,
    ThemeProvider,
    createMuiTheme,
    Tabs,
    IconButton,
    Container,
    Grid
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

import NeedsDefinition from '../routes/NeedsDefinition';
import AbsTabs from './abs/AbsTabs';
import AbsTab from './abs/AbsTab';
import AbsTabPanel from './abs/AbsTabPanel';
import NeedsSorting from '../routes/NeedsSorting';
import Genres from '../routes/Genres';
import Search from '../routes/Search';
import SpotifyProvider from '../../contexts/spotify-auth/SpotifyProvider';
import AbsAlertProvider from './abs/alert/AbsAlertProvider';
import SettingsDialog from './dialogs/SettingsDialog';

const absoluteTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#3E6680'
        },
        secondary: {
            main: '#4BB3FD'
        },
        action: {
            active: '#0496FF'
        }
    }
});

const Application = () => {
    const [tab, setTab] = React.useState(0);
    const [isSettingsOpen, setSettingsOpen] = React.useState(false);

    return (
        <ThemeProvider theme={absoluteTheme}>
            <AbsAlertProvider>
                <div>
                    <Grid
                        container
                        spacing={1}
                        component="header"
                        justify="space-between"
                        alignItems="flex-start"
                    >
                        <Typography variant="h2">Absolute Control</Typography>
                        <IconButton onClick={openSettings}>
                            <SettingsIcon />
                        </IconButton>
                    </Grid>
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
                <SettingsDialog isOpen={isSettingsOpen} onClose={closeSettings} />
            </AbsAlertProvider>
        </ThemeProvider>
    );

    function closeSettings() {
        setSettingsOpen(false);
    }

    function openSettings() {
        setSettingsOpen(true);
    }

    function handleChange(e: any, v?: any) {
        setTab(v);
    }
};

export default hot(Application);
