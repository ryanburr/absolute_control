import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import {
    ListItem,
    ListItemText,
    Typography,
    Divider,
    IconButton,
    LinearProgress,
    Box,
    Tooltip
} from '@material-ui/core';
import RepeatIcon from '@material-ui/icons/Repeat';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import AbsList from '../abs/AbsList';
import AbsCard from '../abs/AbsCard';
import AbsCardHeader from '../abs/AbsCardHeader';
import { useSpotify } from '../../../contexts/spotify-auth/useSpotify';

interface SpotifyLikedSongsProps {
    selectedTrack: SpotifyApi.SavedTrackObject | undefined;
    onSelect: (track: SpotifyApi.SavedTrackObject) => void;
    itemTemplate?: (props: { track: SpotifyApi.SavedTrackObject }) => JSX.Element;
}

const SpotifyLikedSongs = (props: SpotifyLikedSongsProps) => {
    const { itemTemplate: ItemTemplate, selectedTrack, onSelect } = props;

    const [isLoading, setLoading] = React.useState(false);
    const [likedTracks, setLikedTracks] = React.useState<SpotifyApi.SavedTrackObject[]>([]);

    const spotify = useSpotify();

    React.useEffect(() => {
        if (spotify.accessToken) {
            refreshSongs();
        }
    }, [spotify.accessToken]);

    return (
        <AbsCard>
            <AbsCardHeader
                title="Liked Songs"
                subheader="https://spotify.com"
                action={
                    spotify.accessToken ? (
                        <Tooltip title="Refresh list">
                            <IconButton onClick={refreshSongs}>
                                <RepeatIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Log in to Spotify">
                            <IconButton onClick={login}>
                                <LockOpenIcon />
                            </IconButton>
                        </Tooltip>
                    )
                }
            />
            {isLoading ? <LinearProgress variant="indeterminate" /> : <Divider />}
            {likedTracks.length > 0 ? (
                <AbsList>
                    {likedTracks.map(likedTrack =>
                        !ItemTemplate ? (
                            <ListItem
                                button
                                key={likedTrack.track.id}
                                onClick={() => onSelect(likedTrack)}
                                selected={likedTrack.track.id === selectedTrack?.track.id}
                            >
                                <ListItemText>
                                    {likedTrack.track.artists.map(x => x.name).join(', ')} -{' '}
                                    {likedTrack.track.name}
                                </ListItemText>
                            </ListItem>
                        ) : (
                            <ItemTemplate key={likedTrack.track.id} track={likedTrack} />
                        )
                    )}
                </AbsList>
            ) : (
                <Box p={2}>
                    <Typography>
                        {spotify.accessToken ? 'No files found.' : 'Please log in to Spotify.'}
                    </Typography>
                </Box>
            )}
        </AbsCard>
    );

    async function login() {
        setLoading(true);
        try {
            await spotify.promptLogin();
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    async function refreshSongs() {
        setLoading(true);
        try {
            const result = await spotify.getSavedTracks();
            setLikedTracks(result);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }
};

export default hot(SpotifyLikedSongs);
