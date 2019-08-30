import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl, {FormControlProps} from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table'
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

function searchOptions(jwt: string, searchParam: any): RequestInit {
    const bodyData = {
        'user' : {username: searchParam}
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(bodyData)
    }
    return requestOptions;
}


const tableHeader = () => 
    <thead>
        <tr>
            <th>#</th>
            <th>username</th>
        </tr>
    </thead>

function rowKey(user: any): string {
    return `discover-entry-key-user-${user.user}`;
}
function tableRow(user: any, index: number) {
    console.log(user);
    return (
        <tr key={rowKey(user)}>
            <td>{index}</td>
            <td>{user.user}</td>
        </tr>
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
        debugger;
        this.setState({users: response.users})
    }

    formRender = () => {
        return (
            <Form>
                <Form.Group controlId="formUserSearch">
                    <Form.Label>
                        Search for user by username:
                    </Form.Label>
                    <Form.Control type="text" value={this.state.usernameField} onChange={this.usernameFieldChange}/>
                </Form.Group>
            </Form>
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
                    <tbody>
                        {/* {this.state.responseTopTen.map((score, index) => {return tableRow(score, index)})} */}
                        {this.state.users.map((user: any, index: number) => {return tableRow(user, index)})}
                    </tbody>
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
