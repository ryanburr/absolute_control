import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { makeStyles, createStyles, Grid } from '@material-ui/core';
import SpotifyLikedSongs from '../components/spotify/SpotifyLikedSongs';
import YoutubeSelection from '../components/YoutubeSelection';
import { YoutubeSearchResult } from '../../contracts/YoutubeSearchResult';
import { youtubeClient } from '../../clients/youtube';
import { useAlert } from '../components/abs/alert/useAlert';

const useStyles = makeStyles(
    createStyles({
        scroll: {
            height: '90vh',
            display: 'grid'
        }
    })
);

const Search = () => {
    const classes = useStyles();
    const alert = useAlert();

    const [selectedTrack, setSelectedTrack] = React.useState<SpotifyApi.SavedTrackObject>();
    const [query, setQuery] = React.useState('');

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <SpotifyLikedSongs selectedTrack={selectedTrack} onSelect={loadSong} />
                </Grid>
                <Grid item xs={6}>
                    <YoutubeSelection
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
        try {
            await youtubeClient.get(
                result.id,
                `${selectedTrack?.track.artists.map(x => x.name).join(', ')} - ${
                    selectedTrack?.track.name
                }.mp3`
            );

            alert.success(`${selectedTrack?.track.name} downloaded`);
        } catch (err) {
            alert.error(err.message);
        }
    }

    function loadSong(track: SpotifyApi.SavedTrackObject) {
        setSelectedTrack(track);
        const artists = track.track.artists.map(x => x.name).join(', ');
        setQuery(`${artists} - ${track.track.name}`);
    }
};

export default hot(Search);
