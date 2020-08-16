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

import { Mp3File } from '../../contracts/Mp3File';
import { beatportClient } from '../../clients/beatport';
import { BeatportSearchResult } from '../../contracts/BeatportSearchResults';
import AbsList from './abs/AbsList';
import AbsCard from './abs/AbsCard';
import AbsCardHeader from './abs/AbsCardHeader';
import { useAlert } from './abs/alert/useAlert';

interface SongSelectionProps {
    className?: string;
    file: Mp3File | undefined;
    onSync?: (result: BeatportSearchResult) => Promise<void>;
    query: string;
    onQueryChange: (query: string) => void;
}

const beatportUrl = 'https://beatport.com';

const SongSelection = (props: SongSelectionProps) => {
    const { className, file, onSync, query = '', onQueryChange } = props;

    const alert = useAlert();

    const [isLoading, setLoading] = React.useState<boolean>(false);

    const [, setSelectedResult] = React.useState<BeatportSearchResult>();
    const [selectedIndex, setSelectedIndex] = React.useState<number>();
    const [searchResults, setSearchResults] = React.useState<BeatportSearchResult[]>([]);

    return (
        <AbsCard className={className}>
            <AbsCardHeader title="Search Results" subheader={beatportUrl} />
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
                                    <a
                                        href="#"
                                        onClick={() => openInBeatport(result)}
                                    >{`${result.artists} - ${result.title} (${result.remix})`}</a>
                                }
                                secondary={`${result.genre} - ${
                                    result.releaseDate
                                        ? new Date(result.releaseDate).toLocaleDateString()
                                        : ''
                                }`}
                            />
                            <ListItemSecondaryAction>
                                <Tooltip title="Sync song data with the selected file">
                                    <IconButton
                                        edge="end"
                                        aria-label="sync"
                                        onClick={() => syncInfo(result)}
                                    >
                                        <SyncIcon color="action" />
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
            setSearchResults(await beatportClient.search(query));
        } catch (err) {
            alert.error(err.message);
        }
        setLoading(false);
    }

    function handleChangeQuery(e: React.ChangeEvent<HTMLInputElement>) {
        onQueryChange(e.target.value);
    }

    function openInBeatport(result: BeatportSearchResult) {
        shell.openExternal(beatportUrl + result.detailUrl);
    }

    async function syncInfo(result: BeatportSearchResult): Promise<void> {
        if (onSync) {
            setLoading(true);
            await onSync(result);
            setLoading(false);
        }
    }
};

export default hot(SongSelection);
