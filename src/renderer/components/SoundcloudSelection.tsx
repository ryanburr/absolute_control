/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-closing-bracket-location */
import { shell } from 'electron';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import {
    ListItem,
    ListItemText,
    Typography,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    LinearProgress,
    Box,
    Tooltip,
    TextField
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SearchIcon from '@material-ui/icons/Search';

import { soundcloudClient } from '../../clients/soundcloud';
import { SoundcloudSearchResult } from '../../contracts/SoundcloudSearchResult';
import AbsList from './abs/AbsList';
import AbsCard from './abs/AbsCard';
import AbsCardHeader from './abs/AbsCardHeader';
import { useAlert } from './abs/alert/useAlert';

interface SoundcloudSelectionProps {
    className?: string;
    track: SpotifyApi.SavedTrackObject | undefined;
    onDownload?: (result: SoundcloudSearchResult) => Promise<void>;
    query: string;
    onQueryChange: (query: string) => void;
}

const soundcloudUrl = 'https://soundcloud.com';

const SoundcloudSelection = (props: SoundcloudSelectionProps) => {
    const { className, track, onDownload, query = '', onQueryChange } = props;

    const alert = useAlert();

    const [isLoading, setLoading] = React.useState<boolean>(false);

    const [selectedResult, setSelectedResult] = React.useState<SoundcloudSearchResult>();
    const [selectedIndex, setSelectedIndex] = React.useState<number>();
    const [searchResults, setSearchResults] = React.useState<SoundcloudSearchResult[]>([]);

    return (
        <AbsCard className={className}>
            <AbsCardHeader title="Search Results" subheader={soundcloudUrl} />
            <Divider />
            <Box p={2}>
                <TextField
                    variant="outlined"
                    label="Query"
                    value={query}
                    onChange={handleChangeQuery}
                    onKeyDown={handleEnter}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={search}>
                                <SearchIcon color="action" />
                            </IconButton>
                        )
                    }}
                    fullWidth
                />
            </Box>
            {isLoading ? <LinearProgress variant="indeterminate" /> : <Divider />}
            {searchResults.length > 0 ? (
                <AbsList>
                    {searchResults.map((result, i) => (
                        <ListItem key={i} selected={i === selectedIndex}>
                            <ListItemText
                                primary={
                                    <a href="#" onClick={() => open(result)}>
                                        {result.title}
                                    </a>
                                }
                                secondary={result.artist}
                            />
                            <ListItemSecondaryAction>
                                <Tooltip title="Download">
                                    <IconButton
                                        edge="end"
                                        aria-label="sync"
                                        onClick={() => download(result)}
                                    >
                                        <CloudDownloadIcon color="action" />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </AbsList>
            ) : (
                <Box p={2}>
                    <Typography>No results found.</Typography>
                </Box>
            )}
        </AbsCard>
    );

    function handleEnter(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            search();
        }
    }

    async function search() {
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            setSearchResults(await soundcloudClient.search(query));
        } catch (err) {
            alert.error(err.message);
        }
        setLoading(false);
    }

    function handleChangeQuery(e: React.ChangeEvent<HTMLInputElement>) {
        onQueryChange(e.target.value);
    }

    function open(result: SoundcloudSearchResult) {
        shell.openExternal(soundcloudUrl + result.href);
    }

    async function download(result: SoundcloudSearchResult): Promise<void> {
        if (onDownload) {
            setLoading(true);
            await onDownload(result);
            setLoading(false);
        }
    }
};

export default hot(SoundcloudSelection);
