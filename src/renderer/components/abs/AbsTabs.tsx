/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-closing-bracket-location */
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { merge } from 'lodash';
import { Tabs, createStyles, makeStyles, TabsProps, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // border: `1px solid ${theme.palette.common.black}`
        }
    })
);

const AbsTabs = (props: TabsProps) => {
    const classes = useStyles();
    const mergedProps = merge({ classes }, props);

    return <Tabs {...mergedProps} />;
};

export default hot(AbsTabs);
