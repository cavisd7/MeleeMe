import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Typography from '@material-ui/core/Typography'

interface Props {
    location: RouteComponentProps['location']
};

const NotFound: React.FC<Props> = (props) => {
    return (
        <Typography variant='h6'>Could not find { props.location.pathname }</Typography>
    );
};

export default NotFound;