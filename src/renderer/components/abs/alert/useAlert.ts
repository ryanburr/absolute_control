import React from 'react';
import { AbsAlertContext } from './AbsAlertContext';

export function useAlert() {
    const manager = React.useContext(AbsAlertContext);
    if (!manager) {
        throw new Error('No AlertProvider found');
    }

    return manager;
}
