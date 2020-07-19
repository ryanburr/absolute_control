import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AbsAlertContext } from './AbsAlertContext';

interface AlertProviderProps {
    children: React.ReactNode | React.ReactNode[];
}

const AbsAlertProvider = (props: AlertProviderProps) => {
    const { children } = props;

    const [isOpen, setOpen] = React.useState(false);
    const [severity, setSeverity] = React.useState<'success' | 'error'>('success');
    const [message, setMessage] = React.useState<string>('');

    return (
        <AbsAlertContext.Provider
            value={{
                success,
                error
            }}
        >
            <Snackbar
                open={isOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
            <>{children}</>
        </AbsAlertContext.Provider>
    );

    function success(msg: string) {
        console.log(msg);
        setSeverity('success');
        setMessage(msg);
        setOpen(true);
    }
    function error(msg: string) {
        console.log(msg);
        setSeverity('error');
        setMessage(msg);
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }
};

export default hot(AbsAlertProvider);
