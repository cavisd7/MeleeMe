import React from 'react';
import { Link } from 'react-router-dom';

import { 
    WithStyles, 
    withStyles, 
    createStyles, 
    Theme 
} from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

type Classes = 
    | 'root'
    | 'link'
    ;

const styles = (theme: Theme) =>
    createStyles({
        root: {},
        link: {
            color: '#32363c',
            '&:hover': {
                color: '#544A49'
            }
        }
    });

interface Override {
    label: string;
    position: number;
}

interface Props {
    title: string;
    pathname: string;
    overrides: Override[];
}

type CombinedProps = Props & WithStyles<Classes>;

class Navigation extends React.Component<CombinedProps, {}> {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate (nextProps: CombinedProps, nextState: {}) {
        return this.props.pathname !== nextProps.pathname
    }

    render () {
        const { 
            classes, 
            title, 
            pathname, 
            overrides 
        } = this.props;

        const url = pathname && pathname.slice(1);
        const allPaths = url.split('/');

        return (
            <div>
                <Breadcrumbs separator="›" >
                    {   
                        allPaths.map((path, i) => {
                            const currentOverride = overrides.find(o => o.position === i)
                            const href = '/' + allPaths.slice(0, i + 1).join('/');

                            return (
                                <div key={i}>
                                    <Link
                                        to={href}
                                    >
                                        <Typography className={classes.link} variant='body1'>
                                            <strong>{currentOverride && currentOverride ? currentOverride.label : path}</strong>
                                        </Typography>
                                    </Link>
                                </div>
                            );
                        })
                    }
                </Breadcrumbs>
            </div>
        );
    }
}

const styled = withStyles(styles);

export default styled(Navigation);