import * as path from 'path';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { Typography, makeStyles, createStyles } from '@material-ui/core';
import FileList from '../components/FileList';
import { Mp3File } from '../../contracts/Mp3File';
import SongSelection from '../components/SongSelection';
import { needsSortingPath } from '../../constants';

const useStyles = makeStyles(
    createStyles({
        row: {
            display: 'flex'
        }
    })
);

const NeedsSorting = () => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = React.useState<Mp3File>();

    return (
        <>
            <section className={classes.row}>
                <FileList
                    title="Source Folder"
                    path={needsSortingPath}
                    selectedFile={selectedFile}
                    onSelect={loadSong}
                />
            </section>
        </>
    );

    function loadSong(file: Mp3File) {
        setSelectedFile(file);
    }
};

export default hot(NeedsSorting);
