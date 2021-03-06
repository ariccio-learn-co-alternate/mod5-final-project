import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
// import {Dispatch} from 'redux'
import {loginUser} from '../Actions';
import {login, LoginResponse} from '../utils/Authentication';

interface LoginProps {
    currentUser: string,
    loginUser: any
}

interface LoginState {
    readonly username: string,
    readonly password: string
}

const defaultLoginState: LoginState = {
    username: '',
    password: ''
}


class _Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = defaultLoginState;
    usernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({username: event.target.value})
    }

    passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({password: event.target.value})
    }

    onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response: LoginResponse | null = await login(this.state.username, this.state.password);
        if (response === null) {
            this.setState({username: '', password: ''});
            return;
        }
        this.props.loginUser(response.username, response.email, response.jwt)
        // <Redirect to='/'/>
        // alert("TODO: redirect here. For now please refresh.")
    } 

    inputField = () =>
        <input
            name="email"
            type="text"
            placeholder="email"
            value={this.state.username}
            onChange={this.usernameChange}
        />

    passwordField = () => 
        <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.passwordChange}
        />


    formWithLink() {
        return (
            <>
                <form onSubmit={this.onSubmit}>
                    {this.inputField()}
                    {this.passwordField()}
                    <button type="submit">Login</button>
                </form>
                <Link to='/signup'>Sign up</Link>
            </>
        );
    }

    render() {
        if (this.props.currentUser !== '') {
            console.log(`current user (${this.props.currentUser}) not empty, leaving login page`)
            return (<Redirect to='/'/>);
        }
        return this.formWithLink();
    }
}

// Don't know the types yet.
const mapStateToProps = (state: any): any => {
    // console.log(state)
    return {
      currentUser: state.currentUser
    }
  }

const mapDispatchToProps = (dispatch: any): any => {
    return {
        loginUser: (username: string, email: string, jwt: string) => dispatch(loginUser(username, email, jwt))
    }
}
export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);
