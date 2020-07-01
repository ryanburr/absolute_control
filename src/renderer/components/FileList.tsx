import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import {
    List,
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

interface FileListProps {
    title?: string;
    path: string;
    selectedFile: Mp3File | undefined;
    onSelect: (file: Mp3File) => void;
    itemTemplate?: (props: { file: Mp3File }) => JSX.Element;
}

const FileList = (props: FileListProps) => {
    const { itemTemplate: ItemTemplate, selectedFile, path, onSelect, title } = props;

    const [isLoading, setLoading] = React.useState(false);
    const [files, setFiles] = React.useState<Mp3File[]>([]);

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
                                key={getFileName(file.path)}
                                onClick={() => onSelect(file)}
                                selected={file.path === selectedFile?.path}
                            >
                                <ListItemText>{getFileName(file.path)}</ListItemText>
                            </ListItem>
                        ) : (
                            <ItemTemplate key={file.path} file={file} />
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

    async function refreshFiles() {
        setLoading(true);
        setFiles(await readFiles(path));
        setLoading(false);
    }
};

export default hot(FileList);
