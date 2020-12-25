import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl, {FormControlProps} from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';

import {formatErrors} from '../utils/ErrorObject';


interface DiscoverState {
    readonly usernameField: string,
    readonly users: Array<UserSearchResponseSingleUser>
}

const defaultDiscoverState: DiscoverState = {
    usernameField: '',
    users: Array()
}

interface DiscoverProps {
    currentUser: string
}

function searchOptions(jwt: string, searchParam: string): RequestInit {
    const bodyData = {
        'user' : {username: searchParam}
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(bodyData)
    };
    return requestOptions;
}

function addFriendOptions(jwt: string, friend_id: string) {
    const bodyData = {
        'user' : {friend_id: friend_id}
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(bodyData)
    };
    return requestOptions;
}

function rowKey(user: string): string {
    return `discover-entry-key-user-${user}`;
}

const tableHeader = () =>
    <thead>
        <tr>
            <th>#</th>
            <th>username</th>
            <th>Add friend</th>
        </tr>
    </thead>



interface UserSearchResponseSingleUser {
    user: string,
    user_id: string
}

interface UsersSearchResponseType {
    users: Array<UserSearchResponseSingleUser>,
    errors?: any

}

function usersSearchResponseToStrongType(usersSearchResponse: any): UsersSearchResponseType {
    if (usersSearchResponse.errors === undefined) {
        console.assert(usersSearchResponse.users !== undefined);
        if (usersSearchResponse.users.length > 0) {
            console.assert(usersSearchResponse.users[0].user !== undefined);
            console.assert(usersSearchResponse.users[0].user_id !== undefined);
        }
    }
    const return_value: UsersSearchResponseType = {
        users: usersSearchResponse.users
    }
    return return_value;
}

function indexOfFriend(user_id: string, currentUser: string, users: Array<UserSearchResponseSingleUser>): number {
    const userInUsers = users.findIndex((user: UserSearchResponseSingleUser) => user.user_id === user_id);
    if (userInUsers === -1) {
        console.error(`There's something wrong, ${user_id} isn't in users`);
        throw new Error(`There's something wrong, ${user_id} isn't in users`);
    }
    return userInUsers;
}

async function queryAddFriend(user_id: string, currentUser: string): Promise<any> {
    // debugger;
    console.log("Clicked add friend for user_id: ", user_id);
    const rawResponse: Promise<Response> =
        fetch('/users/friends', addFriendOptions(currentUser, user_id));
    const jsonResponse = (await rawResponse).json();
    return jsonResponse;
}

async function fetchSearchResult(options: RequestInit): Promise<UsersSearchResponseType> {
    const rawResponse: Promise<Response> =
        fetch('/users/search', options);
    const jsonResponse = (await rawResponse).json();
    const responseParsed = await jsonResponse;
    const response: UsersSearchResponseType = usersSearchResponseToStrongType(responseParsed);
    if (response.errors !== undefined) {
        console.error(formatErrors(response.errors));
        alert(formatErrors(response.errors));
        return response;
    }
    return response;
}

async function clickAddFriendAndRemoveUserFromArray(user_id: string, currentUser: string, users: Array<UserSearchResponseSingleUser>): Promise<Array<UserSearchResponseSingleUser>> {
    const response = await queryAddFriend(user_id, currentUser);
    if (response.errors !== undefined) {
        console.error(formatErrors(response.errors));
        alert(formatErrors(response.errors));
        return users;
    }
    const userInUsers = indexOfFriend(user_id, currentUser, users);
    
    const newUsers = [...users];
    newUsers.splice(userInUsers, 1);
    return newUsers;
}



class _Discover extends React.Component<DiscoverProps, DiscoverState> {
    state: DiscoverState = defaultDiscoverState;

    addFriendClick = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, user_id: string) => {
        const newUsers = await clickAddFriendAndRemoveUserFromArray(user_id, this.props.currentUser, this.state.users);
        this.setState({users: newUsers});
        return;
    }    

    tableAddFriendButton = (user_id: string) =>
        <td>
            <Button
                variant="primary"
                onClick={
                    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                        this.addFriendClick(e, user_id)
                }
            >
                Add Friend
            </Button>
        </td>

    tableRow = (user: UserSearchResponseSingleUser, index: number) =>
        <tr key={rowKey(user.user)}>
            <td>{index}</td>
            <td>{user.user}</td>
            {this.tableAddFriendButton(user.user_id)}
        </tr>

    
    // See type here: 
    usernameFieldChange = async (event: React.FormEvent<FormControlProps & FormControl>) => {
        if (event.currentTarget.value === undefined) {
            console.warn("undefined target???");
            return;
        }
        const options: RequestInit = searchOptions(this.props.currentUser, event.currentTarget.value);
        this.setState({usernameField: event.currentTarget.value})
        const response: UsersSearchResponseType = await fetchSearchResult(options);
        // debugger;
        this.setState({users: response.users})
    }

    formRender = () =>
        <Form>
            <Form.Group controlId="formUserSearch">
                <Form.Label>
                    Search for user by username:
                </Form.Label>
                <Form.Control
                    type="text"
                    value={this.state.usernameField}
                    onChange={this.usernameFieldChange}
                />
            </Form.Group>
        </Form>

    tableBody = () =>
        <tbody>
            {this.state.users.map(
                (user: UserSearchResponseSingleUser, index: number) =>
                    {return this.tableRow(user, index)}
                )
            }
        </tbody>
    
    table() {
        if (this.state.users === null) {
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

    render() {
        return (
            <>
                {this.formRender()}
                {this.table()}
            </>
        );
    }
}

const mapStateToProps = (state: any): DiscoverProps => {
    return {
      currentUser: state.currentUser
    }
  }


export const Discover = connect(mapStateToProps, null)(_Discover);
