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
import SyncIcon from '@material-ui/icons/Sync';
import SearchIcon from '@material-ui/icons/Search';

import { youtubeClient } from '../../clients/youtube';
import { YoutubeSearchResult } from '../../contracts/YoutubeSearchResult';
import AbsList from './abs/AbsList';
import AbsCard from './abs/AbsCard';
import AbsCardHeader from './abs/AbsCardHeader';

interface YoutubeSelectionProps {
    className?: string;
    track: SpotifyApi.SavedTrackObject | undefined;
    onDownload?: (result: YoutubeSearchResult) => Promise<void>;
    query: string;
    onQueryChange: (query: string) => void;
}

const youtubeUrl = 'https://youtube.com';

const YoutubeSelection = (props: YoutubeSelectionProps) => {
    const { className, track, onDownload, query = '', onQueryChange } = props;

    const [isLoading, setLoading] = React.useState<boolean>(false);

    const [selectedResult, setSelectedResult] = React.useState<YoutubeSearchResult>();
    const [selectedIndex, setSelectedIndex] = React.useState<number>();
    const [searchResults, setSearchResults] = React.useState<YoutubeSearchResult[]>([]);

    return (
        <AbsCard className={className}>
            <AbsCardHeader title="Search Results" subheader={youtubeUrl} />
            <Divider />
            <Box p={2}>
                <TextField
                    variant="outlined"
                    label="Query"
                    value={query}
                    onChange={handleChangeQuery}
                    InputProps={{
                        endAdornment: (
                            <IconButton color="secondary" onClick={search}>
                                <SearchIcon />
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
                                    <a href="#" onClick={() => openInYoutube(result)}>
                                        {result.title}
                                    </a>
                                }
                                secondary={result.metadata}
                            />
                            <ListItemSecondaryAction>
                                <Tooltip title="Download">
                                    <IconButton
                                        edge="end"
                                        aria-label="sync"
                                        onClick={() => download(result)}
                                    >
                                        <SyncIcon />
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

    async function search() {
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            setSearchResults(await youtubeClient.search(query));
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    function handleChangeQuery(e: React.ChangeEvent<HTMLInputElement>) {
        onQueryChange(e.target.value);
    }

    function openInYoutube(result: YoutubeSearchResult) {
        shell.openExternal(youtubeUrl + result.url);
    }

    function setSelection(result: YoutubeSearchResult, index: number) {
        setSelectedResult(result);
        setSelectedIndex(index);
    }

    async function download(result: YoutubeSearchResult): Promise<void> {
        if (onDownload) {
            setLoading(true);
            await onDownload(result);
            setLoading(false);
        }
    }
};

export default hot(YoutubeSelection);
