import React from 'react';
import { connect, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';

import {setUsernameAndEmail, setUserScores} from '../Actions'
import {queryUserInfo, UserInfoType} from '../utils/QueryUserInfo'
import {formatErrors} from '../utils/ErrorObject';
import { profile } from 'console';

interface ProfileProps {
    username: string,
    email: string,
    currentUser: string,
    setUsernameAndEmail: any,
    setUserScores: any,
    scores: any
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

const ScoreBody = (props: any) => {
    const scores = useSelector((state: any) => state.scores);
    //console.log("used hook!");
    //console.log(scores);
    return scores.map((score: any, index: number) => {
        return <tr key={rowKeyScore(index)}>
            <td>{index}</td>
            <td>{score.score}</td>
            <td>{score.level_id}</td>
        </tr>

    })
}

const showFriends = async (currentUser: string): Promise<ShowFriendResponseType> => {
    const rawResponse: Promise<Response> =
        fetch('/users/showfriends', listFriendsOptions(currentUser));
    const jsonResponse = (await rawResponse).json();
    const responseParsed = await jsonResponse;
    const response = showFriendResponseToStrongType(responseParsed);
    if (response.errors !== undefined) {
        console.error(formatErrors(response.errors));
        alert(formatErrors(response.errors));
        //return null;
    }
    return response;
}

const myScores = () => {
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
                {<ScoreBody/>}
            </tbody>

        </Table>
    );
}

const ProfileRenderTable = (response: ShowFriendResponseType) => {
    return (
        <>
            <h3>Friends</h3>
            <Table striped bordered hover>
                {tableHeader()}
                {tableBody(response)}
            </Table>
        </>
    );

}

function friendsTable(response: ShowFriendResponseType | null) {
    if (response === null) {
        return null;
    }
    return ProfileRenderTable(response);
}

function profileRender(username: string, email: string, response: ShowFriendResponseType | null): JSX.Element {
    return (
        <>
            <h1>{username}'s profile</h1>
            <p>Email: {email}</p>
            {friendsTable(response)}
            <h2>My scores</h2>
            {myScores()}
        </>
    );

}

class _Profile extends React.Component<ProfileProps, ProfileState> {
    state = defaultState;
    fetchFriends = async () => {
            // debugger;
            const response = showFriends(this.props.currentUser)
            this.setState({response: await response});
    }


    async componentDidMount() {
        const userInfo: UserInfoType = await queryUserInfo(this.props.currentUser);
        console.log("setting username and email: ", userInfo);
        if (userInfo.user_info === undefined) {
            return;
        }
        this.props.setUsernameAndEmail(userInfo.user_info.username, userInfo.user_info.email);
        this.props.setUserScores(userInfo.user_scores);
    }

    render = (): JSX.Element => {
        if (this.state.response === null) {
            this.fetchFriends();
        }
        return profileRender(this.props.username, this.props.email, this.state.response);
    }
}

// const mspSelector = useSelector((state) => {

// })

const mapStateToProps = (state: any): any => {
    console.log(state);
    return {
        email: state.email,
        username: state.username,
        currentUser: state.currentUser,
        scores: state.scores
    }
}

export const Profile = connect(mapStateToProps, {setUsernameAndEmail, setUserScores})(_Profile);