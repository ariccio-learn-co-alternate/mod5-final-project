import React from 'react';
import { connect } from 'react-redux';

interface ProfileProps {
    username: string,
    email: string
}

class _Profile extends React.Component<ProfileProps, {}> {
    render() {
        return(
            <>
                <h1>{this.props.username}'s profile</h1>
                <p>Email: {this.props.email}</p>
            </>
        );
    }
}

const mapStateToProps = (state: any): any => {
    console.log(state);
    return {
        email: state.email,
        username: state.username
    }
}

export const Profile = connect(mapStateToProps, null)(_Profile);