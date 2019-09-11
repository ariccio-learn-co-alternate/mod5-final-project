import React, {FunctionComponent} from 'react';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';

import {setUsernameAndEmail, setUserScores} from '../Actions'
import {queryUserInfo, UserInfoType, queryOtherUserInfo} from '../utils/QueryUserInfo'
import {formatErrors} from '../utils/ErrorObject';

interface ProfileProps {
    username: string,
    email: string,
    currentUser: string,
    setUsernameAndEmail?: any,
    setUserScores?: any,
    scores: any,
    otherUser?: boolean // Being reused to display other user.
}

interface UserType {
    username: string,
    id: string
}

interface ShowFriendResponseType {
    users: UserType[],
    errors?: any
}

interface ProfileState {
    readonly response: ShowFriendResponseType | null
}

const defaultState: ProfileState = {
    response: null
} 

function listFriendsOptions(jwt: string) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    };
    return requestOptions;
}

function showFriendResponseToStrongType(response: any): ShowFriendResponseType {
    if (response.errors === undefined) {
        console.assert(response.users !== undefined);
    }
    const return_value: ShowFriendResponseType = {
        users: response.users
    }
    return return_value;
}

const tableHeader = () =>
    <thead>
        <tr>
            <th>#</th>
            <th>username</th>
        </tr>
    </thead>

function rowKey(user: string): string {
    return `profile-friend-entry-key-user-${user}`;
}

function rowKeyScore(index: number): string {
    return `profile-myscore-entry-key-user-${index}`;
}
// const tableRow = (user: UserType, index: number) =>
//     <tr key={rowKey(user.username)}>
//         <td>{index}</td>
//         <td>{user.username}</td>
//     </tr>

const mapper = (response: ShowFriendResponseType | null) => {
    if (response === null) {
        return null;
    }
    if (response.users === undefined) {
        console.warn("hmm");
        return null
    }
    return response.users.map((user: any, index: number) => {
        return (
            <tr key={rowKey(user.username)}>
                <td>{index}</td>
                <td>{user.username}</td>
            </tr>
    
        );
    });
}

const tableBody = (response: ShowFriendResponseType | null) =>
        <tbody>
            {mapper(response)}
        </tbody>

class _Profile extends React.Component<ProfileProps, ProfileState> {
    state = defaultState;

    fetchFriends = async () => {
        const rawResponse: Promise<Response> =
            fetch('/users/showfriends', listFriendsOptions(this.props.currentUser));
            const jsonResponse = (await rawResponse).json();
            const responseParsed = await jsonResponse;
            const response = showFriendResponseToStrongType(responseParsed);
            if (response.errors !== undefined) {
                console.error(formatErrors(response.errors));
                alert(formatErrors(response.errors));
                return;
            }
            // debugger;
            this.setState({response: response});
    }

    friendsTable() {
        if (this.state.response === null) {
            this.fetchFriends();
            return null;
        }
        return (
            <>
                <h3>Friends</h3>
                <Table striped bordered hover>
                    {tableHeader()}
                    {tableBody(this.state.response)}
                </Table>
            </>
        );
    }

    async mountOtherUser() {

    }


    async componentDidMount() {
        if ((this.props.otherUser !== null) && (!this.props.otherUser)) {
            this.mountOtherUser();
            return;
        } 
        if ((this.props.email === '') || (this.props.username === '')) {
            const userInfo: UserInfoType = await queryUserInfo(this.props.currentUser);
            console.log("setting username and email: ", userInfo);
            // debugger;
            if (userInfo.user_info === undefined) {
                // debugger;
                return;
            }
            // const data: UserInfoType = userInfoToStrongType(userInfo);
            // console.log(data);
            // debugger;
            
            // If being reused for someone else, will be null.
            if (this.props.setUsernameAndEmail !== null) {
                this.props.setUsernameAndEmail(userInfo.user_info.username, userInfo.user_info.email);
            }
            if (this.props.setUserScores !== null) {
                this.props.setUserScores(userInfo.user_scores);
            }
            // console.log(userInfo.user_scores);
        }
    }

    scoreBody() {
        return this.props.scores.map((score: any, index: number) => {
            return <tr key={rowKeyScore(index)}>
                <td>{index}</td>
                <td>{score.score}</td>
                <td>{score.level_id}</td>
            </tr>

        })
    }

    myScores() {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>score</th>
                        <th>map</th>
                    </tr>
                </thead>
                <tbody>
                    {this.scoreBody()}
                </tbody>

            </Table>
        );
    }

    render = () =>
        <>
            <h1>{this.props.username}'s profile</h1>
            <p>Email: {this.props.email}</p>
            {this.friendsTable()}
            <h2>My scores</h2>
            {this.myScores()}
        </>
}

const mapStateToProps = (state: any): any => {
    console.log(state);
    return {
        email: state.email,
        username: state.username,
        currentUser: state.currentUser,
        scores: state.scores
    }
}

// export const otherPersonProfile = _Profile; 

const OtherProfile: FunctionComponent<{currentUser: string, username: string}> = async (props: any) => {
    const userInfo: UserInfoType = await queryOtherUserInfo(props.currentUser, props.username);
    console.log("setting username and email: ", userInfo);
    // debugger;
    if (userInfo.errors !== undefined) {
        console.error(formatErrors(userInfo.errors));
        alert(formatErrors(userInfo.errors));
        return;
    }

    if (userInfo.user_info === undefined) {
        // debugger;
        console.error('failed to query other user')
        return;
    }

}



export const Profile = connect(mapStateToProps, {setUsernameAndEmail, setUserScores})(_Profile);