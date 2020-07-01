/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-closing-bracket-location */
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { merge } from 'lodash';
import { List, createStyles, makeStyles, ListProps, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // border: `1px solid ${theme.palette.common.black}`
        }
    })
);

const AbsList = (props: ListProps) => {
    const classes = useStyles();
    const mergedProps = merge({ classes }, props);

    return <List {...mergedProps} />;
};

export default hot(AbsList);
