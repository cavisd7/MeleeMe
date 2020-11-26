import React from 'react';
import { Link } from "react-router-dom";

import {
    createStyles,
    withStyles,
    WithStyles
} from '@material-ui/core';

type Classes = 'root';

const styles = (theme: any) =>
    createStyles({
      root: {
        ...theme.overrides.MuiTab.root
      },
    });

type CombinedProps = Props & WithStyles<Classes>;

interface Props {
    href: string;
    label: string;
}

class TabLink extends React.Component<CombinedProps> {
    render () {
        const { classes, href, label } = this.props;
        const pathName = document.location.pathname;

        return (
            <Link
                className={classes.root}
                to={href}
                role="tab"
                aria-selected={pathName === href}
            >
                {label}
            </Link>
        );
    }
}

const styled = withStyles(styles);

export default styled(TabLink);