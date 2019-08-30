import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl, {FormControlProps} from 'react-bootstrap/FormControl';
import Button, {ButtonProps} from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';

import {formatErrors} from '../utils/ErrorObject';


interface DiscoverState {
    usernameField: string,
    users: any
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

const tableHeader = () => {
    return (
        <thead>
            <tr>
                <th>#</th>
                <th>username</th>
                <th>Add friend</th>
            </tr>
        </thead>
    );
}



class _Discover extends React.Component<DiscoverProps, DiscoverState> {
    state: DiscoverState = defaultDiscoverState;

    // See type here: 
    usernameFieldChange = async (event: React.FormEvent<FormControlProps & FormControl>) => {
        if (event.currentTarget.value === undefined) {
            return;
        }
        this.setState({usernameField: event.currentTarget.value})
        const rawResponse: Promise<Response> =
            fetch('/users/search', searchOptions(this.props.currentUser, event.currentTarget.value));
        const jsonResponse = (await rawResponse).json();
        const response = await jsonResponse;
        if (response.errors !== undefined) {
            console.error(formatErrors(response.errors));
            alert(formatErrors(response.errors));
            return;
        }
        // debugger;
        this.setState({users: response.users})
    }

    formRender = () => {
        return (
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
        );
    }

    addFriendClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, user_id: string) => {
        console.log(user_id);
        const rawResponse: Promise<Response> =
            fetch('/users/friends', addFriendOptions(this.props.currentUser, user_id));
        const jsonResponse = (await rawResponse).json();
        const response = await jsonResponse;
        if (response.errors !== undefined) {
            console.error(formatErrors(response.errors));
            alert(formatErrors(response.errors));
            return;
        }
        
        debugger;
    }

    tableAddFriendButton(user: any) {
        return (
            <td>
                <Button
                    variant="primary"
                    onClick={
                        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => this.addFriendClick(e, user.user_id)
                    }
                >
                    Add Friend
                </Button>
            </td>
        );

    }
    tableRow = (user: any, index: number) => {
        console.log(user);
        return (
            <tr key={rowKey(user)}>
                <td>{index}</td>
                <td>{user.user}</td>
                {this.tableAddFriendButton(user)}
            </tr>
        );
    }
    

    tableBody() {
        return (
            <tbody>
                {this.state.users.map((user: any, index: number) => {return this.tableRow(user, index)})}
            </tbody>
        );
    }
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

const mapStateToProps = (state: any) => {
    return {
      currentUser: state.currentUser,
    }
  }


export const Discover = connect(mapStateToProps, null)(_Discover);
