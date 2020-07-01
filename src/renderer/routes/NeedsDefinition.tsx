import * as path from 'path';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { Typography, makeStyles, createStyles, Grid } from '@material-ui/core';
import FileList from '../components/FileList';
import { Mp3File } from '../../contracts/Mp3File';
import SongSelection from '../components/SongSelection';
import { needsDefinitionPath } from '../../constants';
import { getFileName } from '../../utils/getFileName';

const useStyles = makeStyles(
    createStyles({
        row: {
            display: 'flex'
        }
    })
);

const NeedsDefinition = () => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = React.useState<Mp3File>();

    const [query, setQuery] = React.useState('');

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FileList
                        title="Source Folder"
                        path={needsDefinitionPath}
                        selectedFile={selectedFile}
                        onSelect={loadSong}
                    />
                </Grid>
                <Grid item xs={6}>
                    <SongSelection file={selectedFile} query={query} onQueryChange={setQuery} />
                </Grid>
            </Grid>
        </>
    );

    function loadSong(file: Mp3File) {
        setSelectedFile(file);
        setQuery(getFileName(file.path));
    }
};

export default hot(NeedsDefinition);
