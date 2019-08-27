import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {signupUser} from '../Actions';
import {signup} from '../utils/Authentication';


interface SignupState {
    username: string,
    email: string,
    password: string
}

const defaultsignupState: SignupState = {
    username: '',
    email: '',
    password: ''
}

interface SignupProps {
    currentUser: string,
    dispatch: any
}

class _Signup extends React.Component<SignupProps, SignupState> {
    state: SignupState = defaultsignupState; 

    unameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({username: event.target.value})
    }
    passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({password: event.target.value})
    }

    emailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({email: event.target.value});
    }

    onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("signup state: ", this.state)
        try {
            await signup(this.state.username, this.state.email, this.state.password);
        }
        catch(err) {
            console.error(err);
        }
        console.log("signup props: ", this.props);
        this.props.dispatch(signupUser(this.state.username, this.state.email, this.state.password));

    }

    componentDidMount() {
        console.log("signup props: ", this.props);
        if (this.props.currentUser !== '') {
            console.log(`current user (${this.props.currentUser}) not empty, leaving signup page`)
            return (<Redirect to='/'/>);
        }
    }

    render() {
        return (
            <>
                <form onSubmit={ this.onSubmit}>
                    <input name="username" type="text" placeholder="username" value={this.state.username} onChange={this.unameChange}/>
                    <input name="email" type="text" placeholder="example@example.com" value={this.state.email} onChange={this.emailChange}/>
                    <input name="password" type="password" value={this.state.password} onChange={this.passwordChange}/>
                    <button type="submit">Login</button>
                </form>

            </>
        );
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
        signupUser: (username: string, email: string, password: string) => dispatch(signupUser(username, email, password))
    }
}


export const Signup = connect(mapStateToProps, mapDispatchToProps)(_Signup);