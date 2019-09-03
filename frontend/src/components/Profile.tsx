import React from 'react';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';

import {setUsernameAndEmail, setUserScores} from '../Actions'
import {queryUserInfo, UserInfoType} from '../utils/QueryUserInfo'
import {formatErrors} from '../utils/ErrorObject';

interface ProfileProps {
    username: string,
    email: string,
    currentUser: string,
    setUsernameAndEmail: any,
    setUserScores: any
  
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
    response: ShowFriendResponseType | null
}

const defaultState: ProfileState = {
    response: null
} 

function listFriendsOptions(jwt: string) {
    // const bodyData = {
    //     'user' : {friend_id: friend_id}
    // };
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
        // body: JSON.stringify(bodyData)
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

const tableHeader = () => {
    return (
        <thead>
            <tr>
                <th>#</th>
                <th>username</th>
            </tr>
        </thead>
    );
}

function rowKey(user: string): string {
    return `profile-friend-entry-key-user-${user}`;
}


class _Profile extends React.Component<ProfileProps, ProfileState> {
    state = defaultState;

    tableRow = (user: UserType, index: number) => {
        // console.log(user.username);
        return (
            <tr key={rowKey(user.username)}>
                <td>{index}</td>
                <td>{user.username}</td>
            </tr>
        );
    }

    mapper = () => {
        if (this.state.response === null) {
            return null;
        }
        if (this.state.response.users === undefined) {
            console.warn("hmm");
            return null
        }
        return this.state.response.users.map((user: any, index: number) => {return this.tableRow(user, index)});

    }

    tableBody = () => {
        return (
            <tbody>
                {this.mapper()}
            </tbody>
        );
    }

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

    table() {
        if (this.state.response === null) {
            this.fetchFriends();
            return null;
        }
        return (
            <>
                <Table striped bordered hover>
                    {tableHeader()}
                    {this.tableBody()}
                </Table>
            </>
        );
    }


    async componentDidMount() {
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
            this.props.setUsernameAndEmail(userInfo.user_info.username, userInfo.user_info.email);
            this.props.setUserScores(userInfo.user_scores);
        }
    }
    render() {
        return(
            <>
                <h1>{this.props.username}'s profile</h1>
                <p>Email: {this.props.email}</p>
                {this.table()}
            </>
        );
    }
}

const mapStateToProps = (state: any): any => {
    console.log(state);
    return {
        email: state.email,
        username: state.username,
        currentUser: state.currentUser
    }
}

// const mapDispatchToProps = (dispatch: any): any => {
//     return {

//     }
// }

export const Profile = connect(mapStateToProps, {setUsernameAndEmail, setUserScores})(_Profile);