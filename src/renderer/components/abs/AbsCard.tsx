/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-closing-bracket-location */
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { merge } from 'lodash';
import {
    Tab,
    createStyles,
    makeStyles,
    TabProps,
    Theme,
    Typography,
    Box,
    CardProps,
    Card
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // border: `1px solid ${theme.palette.common.black}`
        }
    })
);

const AbsCard = (props: CardProps) => {
    const { children, ...others } = props;
    const classes = useStyles();
    const mergedProps = merge({ classes }, others);

    return (
        <Card elevation={7} {...mergedProps}>
            <>{children}</>
        </Card>
    );
};

export default hot(AbsCard);
