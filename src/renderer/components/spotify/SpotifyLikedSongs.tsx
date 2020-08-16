/* eslint-disable jsx-a11y/anchor-is-valid */
import { shell } from 'electron';
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
    Tooltip,
    ListItemIcon
} from '@material-ui/core';
import RepeatIcon from '@material-ui/icons/Repeat';
import CheckIcon from '@material-ui/icons/Check';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import AbsList from '../abs/AbsList';
import AbsCard from '../abs/AbsCard';
import AbsCardHeader from '../abs/AbsCardHeader';
import { useSpotify } from '../../../contexts/spotify-auth/useSpotify';
import { readFiles } from '../../../utils/readFiles';
import { genresPath } from '../../../constants';

interface LikedTrack {
    track: SpotifyApi.SavedTrackObject;
    isDownloaded: boolean;
}

interface SpotifyLikedSongsProps {
    selectedTrack: SpotifyApi.SavedTrackObject | undefined;
    onSelect: (track: SpotifyApi.SavedTrackObject) => void;
    itemTemplate?: (props: { track: SpotifyApi.SavedTrackObject }) => JSX.Element;
}

const SpotifyLikedSongs = (props: SpotifyLikedSongsProps) => {
    const { itemTemplate: ItemTemplate, selectedTrack, onSelect } = props;

    const [isLoading, setLoading] = React.useState(false);
    const [likedTracks, setLikedTracks] = React.useState<LikedTrack[]>([]);

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
                                key={likedTrack.track.track.id}
                                onClick={() => onSelect(likedTrack.track)}
                                selected={likedTrack.track.track.id === selectedTrack?.track.id}
                            >
                                <ListItemText
                                    secondary={formatMs(likedTrack.track.track.duration_ms)}
                                >
                                    <a href="#" onClick={() => openInSpotify(likedTrack)}>
                                        {likedTrack.track.track.artists.map(x => x.name).join(', ')}{' '}
                                        - {likedTrack.track.track.name}
                                    </a>
                                </ListItemText>
                                {likedTrack.isDownloaded && (
                                    <ListItemIcon>
                                        <Tooltip title="Already in library">
                                            <CheckIcon />
                                        </Tooltip>
                                    </ListItemIcon>
                                )}
                            </ListItem>
                        ) : (
                            <ItemTemplate
                                key={likedTrack.track.track.id}
                                track={likedTrack.track}
                            />
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

    function pad(num: string | number, size: number) {
        return `000${num}`.slice(size * -1);
    }

    function formatMs(ms: number) {
        if (typeof ms === 'undefined') {
            return '';
        }

        const time = parseFloat(ms.toFixed(3));

        const minutes = Math.floor(ms / 1000 / 60);
        const seconds = Math.floor(time - minutes * 60);

        return `${minutes}:${pad(seconds, 2)}`;
    }

    function openInSpotify(track: LikedTrack) {
        shell.openExternal(track.track.track.external_urls.spotify);
    }

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
            const response = await spotify.getSavedTracks();
            const result = await checkDuplicates(response);
            setLikedTracks(result);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    async function checkDuplicates(
        savedTracks: SpotifyApi.SavedTrackObject[]
    ): Promise<LikedTrack[]> {
        const songs = await readFiles(genresPath());

        return savedTracks.map<LikedTrack>(x => ({
            track: x,
            isDownloaded: !!songs?.find(y => {
                return (
                    x.track.name
                        .split(' - ')[0]
                        .trim()
                        .toLowerCase() ===
                    y.mp3.common.title
                        ?.split(' (')[0]
                        .split('feat.')[0]
                        .trim()
                        .toLowerCase()
                );
            })
        }));
    }
};

export default hot(SpotifyLikedSongs);
