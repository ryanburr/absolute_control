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
    CircularProgress,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    LinearProgress,
    Box,
    Tooltip,
    Input,
    TextField
} from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

import { write } from 'fs';
import { readFiles } from '../../utils/readFiles';
import { Mp3File } from '../../contracts/Mp3File';
import { getFileName } from '../../utils/getFileName';
import { beatportClient } from '../../clients/beatport';
import { SearchResult } from '../../contracts/SearchResults';
import AbsList from './abs/AbsList';
import { writeFile } from '../../utils/writeFile';
import { moveToNeedsSort } from '../../utils/moveToNeedsSort';
import AbsCard from './abs/AbsCard';
import AbsCardHeader from './abs/AbsCardHeader';

interface SongSelectionProps {
    className?: string;
    file: Mp3File | undefined;
    onSync?: (result: SearchResult) => Promise<void>;
    query: string;
    onQueryChange: (query: string) => void;
}

const beatportUrl = 'https://beatport.com';

const SongSelection = (props: SongSelectionProps) => {
    const { className, file, onSync, query, onQueryChange } = props;

    const [isLoading, setLoading] = React.useState<boolean>(false);

    const [selectedResult, setSelectedResult] = React.useState<SearchResult>();
    const [selectedIndex, setSelectedIndex] = React.useState<number>();
    const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);

    React.useEffect(() => {
        if (query) {
            executeAsync();
        }
        async function executeAsync() {
            try {
                setLoading(true);
                setSearchResults(await beatportClient.search(query));
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
    }, [query]);

    return (
        <AbsCard className={className}>
            <AbsCardHeader title="Search Results" subheader={beatportUrl} />
            <Divider />
            <Box p={2}>
                <TextField
                    variant="outlined"
                    label="Query"
                    value={query ?? ''}
                    onChange={handleChangeQuery}
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

    function handleChangeQuery(e: React.ChangeEvent<HTMLInputElement>) {
        onQueryChange(e.target.value);
    }

    function openInBeatport(result: SearchResult) {
        shell.openExternal(beatportUrl + result.detailUrl);
    }

    function setSelection(result: SearchResult, index: number) {
        setSelectedResult(result);
        setSelectedIndex(index);
    }

    async function syncInfo(result: SearchResult): Promise<void> {
        if (onSync) {
            setLoading(true);
            await onSync(result);
            setLoading(false);
        }
    }
};

export default hot(SongSelection);
