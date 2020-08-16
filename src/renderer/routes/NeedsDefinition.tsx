import * as path from 'path';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    makeStyles,
    createStyles,
    Grid,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FileList from '../components/FileList';
import { Mp3File } from '../../contracts/Mp3File';
import SongSelection from '../components/SongSelection';
import { needsDefinitionPath } from '../../constants';
import { getFileName } from '../../utils/getFileName';
import { BeatportSearchResult } from '../../contracts/BeatportSearchResults';
import { beatportClient } from '../../clients/beatport';
import { writeFile } from '../../utils/writeFile';
import { moveToNeedsSort } from '../../utils/moveToNeedsSort';
import { useAlert } from '../components/abs/alert/useAlert';
import { moveToCannotFind } from '../../utils/moveToCannotFind';

const useStyles = makeStyles(
    createStyles({
        sticky: {
            position: 'sticky',
            top: 10
        },
        relative: {
            position: 'relative'
        }
    })
);

const NeedsDefinition = () => {
    const classes = useStyles();
    const alert = useAlert();

    const [selectedFile, setSelectedFile] = React.useState<Mp3File>();
    const [query, setQuery] = React.useState('');

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FileList
                        title="Source Folder"
                        path={needsDefinitionPath()}
                        selectedFile={selectedFile}
                        onSelect={loadSong}
                        itemTemplate={({ file }) => (
                            <ListItem
                                button
                                key={getFileName(file.file.path)}
                                onClick={() => loadSong(file.file)}
                                selected={file.file.path === selectedFile?.path}
                            >
                                <ListItemText
                                    primary={getFileName(file.file.path)}
                                    secondary={formatSeconds(file.file.mp3.format.duration)}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={moveFile(file.file)}>
                                        <CloseIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )}
                    />
                </Grid>
                <Grid item xs={6} className={classes.relative}>
                    <SongSelection
                        className={classes.sticky}
                        file={selectedFile}
                        query={query}
                        onQueryChange={setQuery}
                        onSync={syncFile}
                    />
                </Grid>
            </Grid>
        </>
    );

    function moveFile(file: Mp3File) {
        return () => {
            moveToCannotFind(file);
            setSelectedFile(undefined);

            alert.success(`${getFileName(file.path)} moved to "Cannot Find Data" folder`);
        };
    }

    function pad(num: string | number, size: number) {
        return `000${num}`.slice(size * -1);
    }

    function formatSeconds(totalSeconds: number | undefined) {
        if (typeof totalSeconds === 'undefined') {
            return '';
        }

        const time = parseFloat(totalSeconds.toFixed(3));

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(time - minutes * 60);

        return `${minutes}:${pad(seconds, 2)}`;
    }

    async function syncFile(result: BeatportSearchResult) {
        try {
            if (selectedFile) {
                const detail = await beatportClient.get(result.detailUrl);
                await writeFile(selectedFile, detail);
                moveToNeedsSort(selectedFile);
                setSelectedFile(undefined);

                alert.success(`${result.title} synced with Beatport data`);
            }
        } catch (err) {
            alert.error(err.message);
        }
    }

    function loadSong(file: Mp3File) {
        setSelectedFile(file);
        setQuery(getFileName(file.path));
    }
};

export default hot(NeedsDefinition);
