import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl, {FormControlProps} from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';

import {formatErrors} from '../utils/ErrorObject';


interface DiscoverState {
    readonly usernameField: string,
    readonly users: any
}

const defaultDiscoverState: DiscoverState = {
    usernameField: '',
    users: null
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

function rowKey(user: any): string {
    return `discover-entry-key-user-${user.user}`;
}

const tableHeader = () =>
    <thead>
        <tr>
            <th>#</th>
            <th>username</th>
            <th>Add friend</th>
        </tr>
    </thead>

const tableAddFriendButton = (user: any, currentUser: string) =>
    <td>
        <Button
            variant="primary"
            onClick={
                (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                    addFriendClick(e, user.user_id, currentUser)
            }
        >
            Add Friend
        </Button>
    </td>

const tableRow = (user: any, index: number, currentUser: string) =>
    <tr key={rowKey(user)}>
        <td>{index}</td>
        <td>{user.user}</td>
        {tableAddFriendButton(user, currentUser)}
    </tr>


interface UserSearchResponseSingleUser {
    user: string,
    user_id: string
}

interface UsersSearchResponseType {
    users: UserSearchResponseSingleUser[],
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

const addFriendClick = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, user_id: string, currentUser: string) => {
    console.log("Clicked add friend for user_id: ", user_id);
    const rawResponse: Promise<Response> =
        fetch('/users/friends', addFriendOptions(currentUser, user_id));
    const jsonResponse = (await rawResponse).json();
    const response = await jsonResponse;
    if (response.errors !== undefined) {
        console.error(formatErrors(response.errors));
        alert(formatErrors(response.errors));
        return;
    }
    return;
}


class _Discover extends React.Component<DiscoverProps, DiscoverState> {
    state: DiscoverState = defaultDiscoverState;

    fetchSearchResult = async (options: RequestInit): Promise<UsersSearchResponseType> => {
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
    // See type here: 
    usernameFieldChange = async (event: React.FormEvent<FormControlProps & FormControl>) => {
        if (event.currentTarget.value === undefined) {
            console.warn("undefined target???");
            return;
        }
        const options: RequestInit = searchOptions(this.props.currentUser, event.currentTarget.value);
        this.setState({usernameField: event.currentTarget.value})
        const response: UsersSearchResponseType = await this.fetchSearchResult(options);
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
                (user: any, index: number) =>
                    {return tableRow(user, index, this.props.currentUser)}
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
                (Table doesn't yet remove item when you add friend, dw)
                {this.table()}
            </>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
      currentUser: state.currentUser
    }
  }


export const Discover = connect(mapStateToProps, null)(_Discover);
