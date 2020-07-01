/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-closing-bracket-location */
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { merge } from 'lodash';
import { Tab, createStyles, makeStyles, TabProps, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // border: `1px solid ${theme.palette.common.black}`
        }
    })
);

const AbsTab = (props: TabProps) => {
    const classes = useStyles();
    const mergedProps = merge({ classes }, props);

    return <Tab {...mergedProps} />;
};

export default hot(AbsTab);
