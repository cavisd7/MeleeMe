import React from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
import {
    createStyles,
    Theme,
    withStyles,
    WithStyles
} from '@material-ui/core';

type Classes =
    | 'root'
    ;

export interface Props extends ButtonProps {
    className?: string;
};

const styles = (theme: Theme) =>
    createStyles({
        root: {}
    });

type CombinedProps = Props & WithStyles<Classes>;

const customButton: React.StatelessComponent<CombinedProps> = props => {
    const {
        classes,
        className,
        ...rest
    } = props;

    return (
        <React.Fragment>
            <Button
                variant='contained' 
                disableElevation
                {...rest}
                disabled={props.disabled}
            >
                <span>
                    {props.children}
                </span>
            </Button>
        </React.Fragment>
    );
};

const styled = withStyles(styles);

export default styled(customButton);
