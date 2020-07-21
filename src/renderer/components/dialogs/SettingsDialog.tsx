import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    Typography,
    TextField
} from '@material-ui/core';
import { pathSettings } from '../../../utils/settings';

interface Settings {
    root_music_path?: string;
}

export interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsDialog = (props: SettingsDialogProps) => {
    const { isOpen, onClose } = props;

    const [settings, setSettings] = React.useState<Settings>({});

    React.useEffect(() => {
        if (isOpen) {
            setSettings({
                root_music_path: pathSettings.get<string | undefined>('root_music_path') ?? ''
            });
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs" disableBackdropClick>
            <DialogTitle>Settings</DialogTitle>
            <Divider />
            <DialogContent>
                <Typography variant="h6">File Paths</Typography>
                <TextField
                    label="Root Music Folder"
                    value={settings.root_music_path ?? ''}
                    onChange={updateField('root_music_path')}
                    fullWidth
                />
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={save}>Save</Button>
            </DialogActions>
        </Dialog>
    );

    function updateField(name: keyof Settings) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            const { value } = e.currentTarget;
            return setSettings(state => ({ ...state, [name]: value }));
        };
    }

    function save() {
        Object.keys(settings).forEach(key => {
            const value = settings[key as keyof Settings];
            pathSettings.set(key, value);
        });

        onClose();
    }
};

export default hot(SettingsDialog);
