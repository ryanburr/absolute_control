/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-closing-bracket-location */
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { merge } from 'lodash';
import { Tab, createStyles, makeStyles, TabProps, Theme, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // border: `1px solid ${theme.palette.common.black}`
        }
    })
);

interface TabPanelProps {
    index: number;
    value: number;
    children: React.ReactChildren | React.ReactChild;
}

const AbsTabPanel = (props: TabPanelProps) => {
    const { children, index, value } = props;
    const classes = useStyles();
    const mergedProps = merge({ classes }, props);

    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box p={2}>{children}</Box>}
        </div>
    );
};

export default hot(AbsTabPanel);
