import React from 'react';

export interface AlertManager {
    success: (message: string) => void;
    error: (message: string) => void;
}

export const AbsAlertContext = React.createContext<AlertManager | undefined>(undefined);
