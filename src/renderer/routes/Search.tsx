import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { makeStyles, createStyles, Grid } from '@material-ui/core';
import SpotifyLikedSongs from '../components/spotify/SpotifyLikedSongs';
import YoutubeSelection from '../components/YoutubeSelection';
import { YoutubeSearchResult } from '../../contracts/YoutubeSearchResult';
import { youtubeClient } from '../../clients/youtube';

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

const Search = () => {
    const classes = useStyles();
    const [selectedTrack, setSelectedTrack] = React.useState<SpotifyApi.SavedTrackObject>();

    const [query, setQuery] = React.useState('');

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <SpotifyLikedSongs selectedTrack={selectedTrack} onSelect={loadSong} />
                </Grid>
                <Grid item xs={6} className={classes.relative}>
                    <YoutubeSelection
                        className={classes.sticky}
                        track={selectedTrack}
                        query={query}
                        onQueryChange={setQuery}
                        onDownload={download}
                    />
                </Grid>
            </Grid>
        </>
    );

    async function download(result: YoutubeSearchResult) {
        await youtubeClient.get(
            result.id,
            `${selectedTrack?.track.artists.map(x => x.name).join(', ')} - ${
                selectedTrack?.track.name
            }.mp3`
        );
    }

    function loadSong(track: SpotifyApi.SavedTrackObject) {
        setSelectedTrack(track);
        const artists = track.track.artists.map(x => x.name).join(', ');
        setQuery(`${artists} - ${track.track.name}`);
    }
};

export default hot(Search);
