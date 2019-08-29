import React from 'react';
import { connect } from 'react-redux';

import {setUsernameAndEmail} from '../Actions'
import {queryUserInfo} from '../utils/QueryUserInfo'

interface ProfileProps {
    username: string,
    email: string,
    currentUser: string,
    setUsernameAndEmail: any
  
}

class _Profile extends React.Component<ProfileProps, {}> {
    async componentDidMount() {
        if ((this.props.email === '') || (this.props.username === '')) {
            const userInfo = await queryUserInfo(this.props.currentUser);
            // console.log(await userInfo);
            this.props.setUsernameAndEmail(userInfo.username, userInfo.email);
        }
    }
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
        username: state.username,
        currentUser: state.currentUser
    }
}

// const mapDispatchToProps = (dispatch: any): any => {
//     return {

//     }
// }

export const Profile = connect(mapStateToProps, { setUsernameAndEmail})(_Profile);