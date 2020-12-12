import React from 'react';
import { RouteComponentProps, withRouter, Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import * as uuid from 'uuid';

import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { ApplicationState } from '../../store/index';

import { sendMessage } from '../../store/chat/chat.actions';
import { getMatchMessages } from '../../store/chat/chat.requests';
import { confirmMatch, denyMatch } from '../../store/matchmaking/matchmaking.actions';

import { Message } from 'types/message';
import { Match, NegotiateMatchRequest } from 'types/match';
import { APIErrorResponse } from 'api/types';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import SplashScreen from '../SplashScreen';
import ChatConversationsSideMenu from './Conversations/ChatConversationSideMenu';

const ChatSelectedConversation = Loadable({
    loader: () => import('./Messages/ChatSelectedConversation'),
    loading: () => SplashScreen
});

const MessagesLanding = Loadable({
    loader: () => import('./MessagesLanding'),
    loading: () => SplashScreen
});


type CombinedProps = StoreProps & DispatchProps & RouteComponentProps;

interface State {
    currentMatchId: string;
    loading: boolean;
};

class Chat extends React.Component<CombinedProps, State> {
    state = {
        currentMatchId: this.props.location.pathname.split('/')[2] || '',
        loading: this.props.matchLoading
    };

    shouldComponentUpdate (nextProps: CombinedProps, nextState: State) {
        return nextState.currentMatchId !== this.state.currentMatchId 
            || nextProps.matchLoading !== this.props.matchLoading 
            || nextProps.chatLoading !== this.props.chatLoading 
            || this.props.messages[this.state.currentMatchId] !== nextProps.messages[this.state.currentMatchId];
    }

    changeConversation = (e: React.MouseEvent, matchId: string) => {
        const { history, match } = this.props;
        this.setState({ currentMatchId: matchId });
        history.push(`/messages/${matchId}`)
    };

    sendMessageCallback = (messageText: string) => {
        const { 
            userId, 
            username, 
            avatar,
            sendMessageDispatch 
        } = this.props;

        const { currentMatchId } = this.state;

        sendMessageDispatch({
            avatar,
            matchId: currentMatchId,
            messageId: uuid.v4(),
            senderId: userId,
            sender: username,
            text: messageText,
            dateSent: new Date()
        });
    }

    handleDenyMatch = () => {
        this.props.denyMatchDispatch(this.props.negotiateMatchRequest);
    }

    render() {
        const { 
            userId, 
            matches,
            getMatchMessagesDispatch,
            chatLoading,
            chatError,
            confirmMatchDispatch,
            matchLoading,
            matchError,
        } = this.props;
        const { currentMatchId } = this.state;

        return (
            <React.Fragment>
                <Grid container spacing={0}>
                    <Hidden smDown>
                        <Grid item style={{height: '100%', /*maxWidth: '300px', minWidth: '230px'*/}} md={2}>
                            <ChatConversationsSideMenu 
                                currentMatchId={currentMatchId}
                                userId={userId} 
                                matches={matches} 
                                handleChangeConversation={this.changeConversation}
                            />
                        </Grid>
                    </Hidden>
                    <Grid item style={{height: '100%'}} xs={12} md={10} container direction='column' >
                        <Switch>
                            <Route 
                                path={`/messages`} 
                                exact
                                render={() => <MessagesLanding />} 
                            />
                            {
                                (!matchLoading && !matchError) ? (
                                    <Route 
                                        path={`/messages/:messageId`} 
                                        render={(props) => 
                                            <ChatSelectedConversation 
                                                {...props} 
                                                userId={userId}
                                                match={matches.filter(match => match.matchId === currentMatchId)[0]}
                                                messages={this.props.messages[currentMatchId]}
                                                sendMessage={this.sendMessageCallback} 
                                                getMatchMessages={getMatchMessagesDispatch}
                                                loading={chatLoading}
                                                error={chatError}
                                                //matchLoading={matchLoading}
                                                //matchError={matchError}
                                                handleDenyMatch={this.handleDenyMatch}
                                                confirmMatch={(params) => confirmMatchDispatch(params)}
                                            />
                                        } 
                                    />
                                ) : (
                                    <p>loading match...</p>
                                )
                            }
                        </Switch>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    };
};

interface StoreProps {
    userId: string;
    username: string;
    avatar: string;
    matches: Match[];
    messages: { [key: string]: Message[] };
    chatLoading: boolean;
    chatError: APIErrorResponse;
    matchLoading: boolean;
    matchError: APIErrorResponse;
    negotiateMatchRequest: NegotiateMatchRequest;
};

const mapStateToProps: MapStateToProps<StoreProps, {}, ApplicationState> = state => ({
    userId: state.account.user.userId,
    username: state.account.user.username,
    avatar: state.account.user?.avatar,
    matches: state.match.matches,
    messages: state.chat.messages,
    chatLoading: state.chat.loading,
    chatError: state.chat.error,
    matchLoading: state.match.loading,
    matchError: state.match.error,
    negotiateMatchRequest: state.matchmaking.negotiating
});

interface DispatchProps {
    sendMessageDispatch: (message: Message) => void; 
    getMatchMessagesDispatch: (params: { matchId: string; range: number }) => Promise<Message[]>;
    confirmMatchDispatch: (params: { matchId: string; }) => void;
    denyMatchDispatch: (negotiateMatchRequest: NegotiateMatchRequest) => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch: ThunkDispatch<ApplicationState, undefined, Action<any>>) => {
    return {
        sendMessageDispatch: (message) => dispatch(sendMessage(message)),
        getMatchMessagesDispatch: (params) => dispatch(getMatchMessages(params)),
        confirmMatchDispatch: (params) => dispatch(confirmMatch(params)),
        denyMatchDispatch: (negotiateMatchRequest) => dispatch(denyMatch(negotiateMatchRequest))
    };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(Chat);

export default withRouter(connected)

/**
 * <div style={{ height: 'inherit', backgroundColor: '#eeeded'}}>
                            <Grid container direction='column' style={{height: '100%'}}>
                                <Grid item style={{ minHeight: '60px', maxHeight: '60px', backgroundColor: '#eeeded', padding: '10px 0px', borderBottom: '1px solid #e6dfdf' }}>
                                    <ChatConversationListHeader />
                                </Grid>
                                <Grid item style={{ height: 'calc(100vh - 60px - 48px)', overflowY: 'auto' }}>
                                    <ChatConversationList 
                                        userId={userId}
                                        matches={matches}
                                        changeConversationCallback={this.changeConversation} 
                                    />
                                </Grid>
                            </Grid>
                        </div>
 */