import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import GenericMenuItem from './core/menu/GenericMenuItem';
import { Avatar, Button, Collapse } from '@material-ui/core';
import { Notifications } from 'types/notification';

interface Props {
    isMenuOpen: boolean;
    notifications: Notifications | null;
    history: RouteComponentProps['history']
};

interface State {
    selectedId: string;
    subOpen: boolean;
};

type CombinedProps = Props;

class NotificationsList extends React.Component<CombinedProps, State> {
    constructor(props) {
        super(props);

        this.state = {
            selectedId: '',
            subOpen: false
        }
    };

    shouldComponentUpdate(nextProps) {
        if (this.props.isMenuOpen) {
            return true;
        };
    };

    handleCollapse = (e, matchId) => {
        this.setState(({ subOpen, selectedId }) => {  return { subOpen: !subOpen, selectedId: subOpen && matchId === selectedId ? '' : matchId } });
    };

    render() {
        const { history, notifications, isMenuOpen } = this.props;

        return (
            <Grid container direction='column' style={{minWidth: '500px', maxWidth: '500px', maxHeight: '850px'}}>
                <Grid item style={{ padding: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,.15),0 0 2px rgba(0,0,0,.1)' }}>
                    <Typography>Header</Typography>
                </Grid>
                <Grid item>
                    <MenuList style={{ margin: '0px 8px', padding: '4px 0px' }} autoFocusItem={isMenuOpen}>
                        {
                            notifications ?
                                Object.keys(notifications).map(matchId => {
                                    return (
                                        <div>
                                            <GenericMenuItem
                                                onClick={notifications[matchId].length > 1 ? (e) => this.handleCollapse(e, matchId) : () => history.push(`/messages/${matchId}`)}
                                            >
                                                <Grid container alignItems='center' spacing={0}>
                                                    <Grid item xs={1} container justify='center'>
                                                        { this.state.subOpen && this.state.selectedId === matchId ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
                                                    </Grid>
                                                    <Grid item xs={2} container justify='center'>
                                                        <Avatar />
                                                    </Grid>
                                                    <Grid item xs={7} container spacing={0} wrap='nowrap' direction='column'>
                                                        <Grid item>
                                                            <Typography>{ notifications[matchId][0].sender }</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant='subtitle2' noWrap>{ notifications[matchId][0].message }</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={2} container justify='flex-end'>
                                                        <Button>X</Button>
                                                    </Grid>
                                                </Grid>
                                            </GenericMenuItem>
                                            {
                                                notifications[matchId].length > 1 && (
                                                    <Collapse in={this.state.subOpen && this.state.selectedId === matchId} unmountOnExit>
                                                        <MenuList style={{backgroundColor: '#eeeded'}}>
                                                            {
                                                                notifications[matchId].map(subItem => {
                                                                    return (
                                                                        <MenuItem>{subItem.sender}</MenuItem>
                                                                    );
                                                                })
                                                            }
                                                        </MenuList>
                                                    </Collapse>
                                                ) 
                                            }
                                        </div>
                                    );
                                })
                            :
                                <div> 
                                    <Typography variant='h6'>No notifications</Typography>
                                </div>
                        }
                    </MenuList>
                </Grid>
            </Grid>
        );
    };
};

export default NotificationsList;