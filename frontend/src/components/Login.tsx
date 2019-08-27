import React from 'react';
import {Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
// import {Dispatch} from 'redux'
import {loginUser} from '../Actions';
import {login} from '../utils/Authentication';

interface LoginProps {
    currentUser: string,
    dispatch: any
}

interface LoginState {
    username: string,
    password: string
}

const defaultLoginState: LoginState = {
    username: '',
    password: ''
}
class _Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = defaultLoginState;
    unameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({username: event.target.value})
    }
    passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({password: event.target.value})
    }

    onSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(this.state.username, this.state.password).then(response => {
            this.props.dispatch(loginUser(this.state.username, this.state.password))
        })
    } 

    componentDidMount() {
        console.log("Login props: ", this.props);
        if (this.props.currentUser !== '') {
            console.log(`current user (${this.props.currentUser}) not empty, leaving login page`)
            return (<Redirect to='/'/>);
        }
    }

    render() {
        return (
            <>
                <form onSubmit={ this.onSubmit}>
                    <input name="username" type="text" placeholder="username" value={this.state.username} onChange={this.unameChange}/>
                    <input name="password" type="password" value={this.state.password} onChange={this.passwordChange}/>
                    <button type="submit">Login</button>
                </form>
            </>
        )
    }
}

// Don't know the types yet.
const mapStateToProps = (state: any): any => {
    console.log(state)
    return {
      currentUser: state.currentUser
    }
  }

const mapDispatchToProps = (dispatch: any): any => {
    return {
        loginUser: (username: string, password: string) => dispatch(loginUser(username, password))
    }
}
export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);