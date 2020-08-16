import * as path from 'path';
import * as fs from 'fs';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import {
    Typography,
    makeStyles,
    createStyles,
    ListItem,
    ListItemText,
    Button,
    LinearProgress,
    ListItemSecondaryAction,
    IconButton,
    ListItemIcon,
    Tooltip,
    Grid
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import WarningIcon from '@material-ui/icons/Warning';
import FileList from '../components/FileList';
import { Mp3File } from '../../contracts/Mp3File';
import SongSelection from '../components/SongSelection';
import { needsSortingPath, genresPath } from '../../constants';
import { sortByGenre } from '../../utils/sortByGenre';
import { useAlert } from '../components/abs/alert/useAlert';

const useStyles = makeStyles(
    createStyles({
        column: {
            display: 'flex',
            flexDirection: 'column'
        }
    })
);

const NeedsSorting = () => {
    const classes = useStyles();
    const alert = useAlert();

    const [isLoading, setLoading] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<Mp3File>();

    return (
        <>
            <Grid container component="section" direction="column">
                {isLoading && <LinearProgress variant="indeterminate" />}
                <Grid item xs={6}>
                    <Button variant="contained" onClick={sortSongs}>
                        Sort into genres
                    </Button>
                </Grid>
                <FileList
                    title="Source Folder"
                    path={needsSortingPath()}
                    dupCheckPath={genresPath()}
                    selectedFile={selectedFile}
                    onSelect={loadSong}
                    itemTemplate={({ file }) => (
                        <ListItem
                            button
                            onClick={() => setSelectedFile(file.file)}
                            selected={file.file.path === selectedFile?.path}
                        >
                            <ListItemText
                                primary={`${file.file.mp3.common.artists} - ${file.file.mp3.common.title}`}
                                secondary={`${file.file.mp3.common.genre} - ${
                                    file.file.mp3.common.date
                                        ? new Date(file.file.mp3.common.date).toLocaleDateString()
                                        : ''
                                }`}
                            />
                            {file.isDup && (
                                <ListItemIcon>
                                    <Tooltip title="Duplicate found.">
                                        <WarningIcon color="disabled" />
                                    </Tooltip>
                                </ListItemIcon>
                            )}
                            <ListItemSecondaryAction>
                                <Tooltip title="Delete File">
                                    <IconButton onClick={deleteFile(file.file)}>
                                        <DeleteIcon color="action" />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                />
            </Grid>
        </>
    );

    function deleteFile(file: Mp3File) {
        return async () => {
            try {
                fs.unlinkSync(file.path);
                alert.success(`File deleted.`);
                setSelectedFile(undefined);
            } catch (err) {
                alert.error(err.message);
            }
        };
    }

    async function sortSongs() {
        setLoading(true);
        try {
            await sortByGenre(needsSortingPath(), genresPath());
        } catch (err) {
            alert.error(err.message);
        }
        setLoading(false);
    }

    function loadSong(file: Mp3File) {
        setSelectedFile(file);
    }
};

export default hot(NeedsSorting);
