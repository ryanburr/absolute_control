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

import { readFiles } from '../../utils/readFiles';
import { Mp3File } from '../../contracts/Mp3File';
import { getFileName } from '../../utils/getFileName';
import AbsList from './abs/AbsList';
import AbsCard from './abs/AbsCard';
import AbsCardHeader from './abs/AbsCardHeader';

interface FileCheck {
    file: Mp3File;
    isDup: boolean;
}

interface FileListProps {
    title?: string;
    path: string;
    dupCheckPath?: string;
    selectedFile: Mp3File | undefined;
    onSelect: (file: Mp3File) => void;
    itemTemplate?: (props: { file: FileCheck }) => JSX.Element;
}

const FileList = (props: FileListProps) => {
    const { itemTemplate: ItemTemplate, selectedFile, path, dupCheckPath, onSelect, title } = props;

    const [isLoading, setLoading] = React.useState(false);
    const [files, setFiles] = React.useState<FileCheck[]>([]);

    React.useEffect(() => {
        if (!selectedFile) {
            refreshFiles();
        }
    }, [selectedFile]);

    return (
        <AbsCard>
            <AbsCardHeader
                title={`${title} (${files.length})`}
                subheader={path}
                action={
                    <Tooltip title="Refresh list">
                        <IconButton onClick={refreshFiles}>
                            <RepeatIcon />
                        </IconButton>
                    </Tooltip>
                }
            />
            {isLoading ? <LinearProgress variant="indeterminate" /> : <Divider />}
            {files.length > 0 ? (
                <AbsList>
                    {files.map(file =>
                        !ItemTemplate ? (
                            <ListItem
                                button
                                key={getFileName(file.file.path)}
                                onClick={() => onSelect(file.file)}
                                selected={file.file.path === selectedFile?.path}
                            >
                                <ListItemText
                                    primary={getFileName(file.file.path)}
                                    secondary={formatSeconds(file.file.mp3.format.duration)}
                                />
                            </ListItem>
                        ) : (
                            <ItemTemplate key={file.file.path} file={file} />
                        )
                    )}
                </AbsList>
            ) : (
                <Box p={2}>
                    <Typography>No files found.</Typography>
                </Box>
            )}
        </AbsCard>
    );

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

    async function refreshFiles() {
        setLoading(true);

        const filesAtPath = await readFiles(path);
        const dupCheckFiles = dupCheckPath ? await readFiles(dupCheckPath) : null;

        setFiles(
            filesAtPath.map(x => ({
                file: x,
                isDup:
                    !!dupCheckFiles?.find(
                        y =>
                            x.mp3.common.title?.trim().toLowerCase() ===
                            y.mp3.common.title?.trim().toLowerCase()
                    ) ?? false
            }))
        );
        setLoading(false);
    }
};

export default hot(FileList);
