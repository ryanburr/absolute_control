import * as path from 'path';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import {
    Typography,
    makeStyles,
    createStyles,
    ListItem,
    ListItemText,
    Button,
    LinearProgress
} from '@material-ui/core';
import FileList from '../components/FileList';
import { Mp3File } from '../../contracts/Mp3File';
import SongSelection from '../components/SongSelection';
import { needsSortingPath, genresPath } from '../../constants';
import { sortByGenre } from '../../utils/sortByGenre';

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
    const [isLoading, setLoading] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<Mp3File>();

    return (
        <>
            <section className={classes.column}>
                {isLoading && <LinearProgress variant="indeterminate" />}
                <Button variant="contained" onClick={sortSongs}>
                    Sort into genres
                </Button>
                <FileList
                    title="Source Folder"
                    path={needsSortingPath}
                    selectedFile={selectedFile}
                    onSelect={loadSong}
                    itemTemplate={({ file }) => (
                        <ListItem>
                            <ListItemText
                                primary={`${file.mp3.common.artists} - ${file.mp3.common.title}`}
                                secondary={`${file.mp3.common.genre} - ${
                                    file.mp3.common.date
                                        ? new Date(file.mp3.common.date).toLocaleDateString()
                                        : ''
                                }`}
                            />
                        </ListItem>
                    )}
                />
            </section>
        </>
    );

    function sortSongs() {
        setLoading(true);
        sortByGenre(needsSortingPath, genresPath);
        setLoading(false);
    }

    function loadSong(file: Mp3File) {
        setSelectedFile(file);
    }
};

export default hot(NeedsSorting);
