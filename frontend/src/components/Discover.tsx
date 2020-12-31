import React from 'react';
import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import FormControl, {FormControlProps} from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';

import {formatErrors} from '../utils/ErrorObject';

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

async function clickAddFriendAndRemoveUserFromArray(
    user_id: string,
    currentUser: string,
    users: Array<UserSearchResponseSingleUser>): Promise<Array<UserSearchResponseSingleUser>> {
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

const addFriendClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    user_id: string,
    currentUser: string,
    users: Array<UserSearchResponseSingleUser>,
    setUsers: React.Dispatch<React.SetStateAction<UserSearchResponseSingleUser[]>>) => {
        e.preventDefault();
        const newUsers = await clickAddFriendAndRemoveUserFromArray(user_id, currentUser, users);
        setUsers(newUsers);
        return;
}    

//WARNING: DATABASE DOESN'T ENFORCE UNIQUENESS
const tableAddFriendButton = (
    user_id: string,
    currentUser: string,
    users: Array<UserSearchResponseSingleUser>,
    setUsers: React.Dispatch<React.SetStateAction<UserSearchResponseSingleUser[]>>) =>
    <td>
        <Button
            variant="primary"
            onClick={
                (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                    addFriendClick(e, user_id, currentUser, users, setUsers)
            }
        >
            Add Friend
        </Button>
    </td>

const tableRow = (
    user: UserSearchResponseSingleUser, 
    index: number,
    currentUser: string,
    users: Array<UserSearchResponseSingleUser>,
    setUsers: React.Dispatch<React.SetStateAction<UserSearchResponseSingleUser[]>>) =>
    <tr key={rowKey(user.user)}>
        <td>{index}</td>
        <td>{user.user}</td>
        {tableAddFriendButton(user.user_id, currentUser, users, setUsers)}
    </tr>

const usernameFieldChange = async (
    event: React.FormEvent<FormControlProps & FormControl>,
    currentUser: string,
    setUsernameField: React.Dispatch<React.SetStateAction<string>>,
    users: Array<UserSearchResponseSingleUser>,
    setUsers: React.Dispatch<React.SetStateAction<UserSearchResponseSingleUser[]>>) => {
    if (event.currentTarget.value === undefined) {
        console.warn("undefined target???");
        return;
    }
    const options: RequestInit = searchOptions(currentUser, event.currentTarget.value);
    setUsernameField(event.currentTarget.value);
    const response: UsersSearchResponseType = await fetchSearchResult(options);
    // debugger;
    setUsers(response.users)
}


const formRender = (
    usernameField: string,
    currentUser: string,
    setUsernameField: React.Dispatch<React.SetStateAction<string>>,
    users: Array<UserSearchResponseSingleUser>,
    setUsers: React.Dispatch<React.SetStateAction<UserSearchResponseSingleUser[]>>) => {
    
    return (
        <Form>
            <Form.Group controlId="formUserSearch">
                <Form.Label>
                    Search for user by username:
                </Form.Label>
                <Form.Control
                    type="text"
                    value={usernameField}
                    onChange={(event: React.FormEvent<FormControlProps & FormControl>) => { usernameFieldChange(event, currentUser, setUsernameField, users, setUsers) }}
                />
            </Form.Group>
        </Form>
    );
}


const tableBody = (
    users: Array<UserSearchResponseSingleUser>,
    currentUser: string,
    setUsers: React.Dispatch<React.SetStateAction<UserSearchResponseSingleUser[]>>
    ) =>
    <tbody>
        {users.map(
            (user: UserSearchResponseSingleUser, index: number) =>
                {return tableRow(user, index, currentUser, users, setUsers)}
            )
        }
    </tbody>


const table = (
    users: Array<UserSearchResponseSingleUser>,
    currentUser: string,
    setUsers: React.Dispatch<React.SetStateAction<UserSearchResponseSingleUser[]>>
    ) => {
    if (users === null) {
        return null;
    }
    return (
        <>
            <Table striped bordered hover>
                {tableHeader()}
                {tableBody(users, currentUser, setUsers)}
            </Table>
        </>
    );
}

interface empty {

}

export const Discover: React.FC<empty> = () => {
    const [usernameField, setUsernameField] = useState('');
    const [users, setUsers] = useState(Array<UserSearchResponseSingleUser>());
    const currentUser = useSelector((state: any) => state.currentUser);

    return (
        <>
            {formRender(usernameField, currentUser, setUsernameField, users, setUsers)}
            {table(users, currentUser, setUsers)}
        </>
    );

}
