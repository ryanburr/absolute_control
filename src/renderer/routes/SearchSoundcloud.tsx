import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { useAlert } from '../components/abs/alert/useAlert';
import SoundcloudSelection from '../components/SoundcloudSelection';
import { SoundcloudSearchResult } from '../../contracts/SoundcloudSearchResult';

const useStyles = makeStyles(
    createStyles({
        scroll: {
            height: '90vh',
            display: 'grid'
        }
    })
);

const SearchSoundcloud = () => {
    const classes = useStyles();
    const alert = useAlert();

    const [selectedTrack, setSelectedTrack] = React.useState<SpotifyApi.SavedTrackObject>();
    const [query, setQuery] = React.useState('');

    return (
        <>
            <Grid container spacing={1}>
                {/* <Grid item xs={6}>
                    <SpotifyLikedSongs selectedTrack={selectedTrack} onSelect={loadSong} />
                </Grid> */}
                <Grid item xs={6}>
                    <SoundcloudSelection
                        track={selectedTrack}
                        query={query}
                        onQueryChange={setQuery}
                        onDownload={download}
                    />
                </Grid>
            </Grid>
        </>
    );

    async function download(result: SoundcloudSearchResult) {
        try {
            // await youtubeClient.get(
            //     result.id,
            //     `${selectedTrack?.track.artists.map(x => x.name).join(', ')} - ${
            //         selectedTrack?.track.name
            //     }.mp3`
            // );

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

export default hot(SearchSoundcloud);
