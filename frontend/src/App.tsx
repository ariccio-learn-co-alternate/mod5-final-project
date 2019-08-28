import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
// import { switchStatement } from '@babel/types';
import './App.css';

import {clearLocalStorage} from './utils/Authentication';
import {queryUserInfo} from './utils/QueryUserInfo'

import {AppState} from './index'
import {Login} from './components/Login';
import {Signup} from './components/Signup';
import {Play} from './components/Play';
import {NavBar} from './components/Nav'
import {Profile} from './components/Profile'

import {setUsernameAndEmail, SET_USERNAME_AND_EMAIL} from './Actions'

interface AppProps {
  // Nothing yet
  currentUser: string,
  username: string,
  email: string,
  setUsernameAndEmail: any
}

const notImpl = () => 
  <h1>Not implemented.</h1>


const logoutRender = () => {
  clearLocalStorage();
  return (
    renderLogin()
  );
}

const renderLogin = () => {
  return( <><Redirect to='/login'/></>);
}
class _App extends React.Component<AppProps, AppState> {
  renderLoginOrHome = () => {
    if (this.props.currentUser === '') {
      console.log("No cached credentials");
      return renderLogin();
    }
    if ((this.props.username === '') || (this.props.email === '') ) {
      console.log('username or email empty.');
      queryUserInfo(this.props.currentUser).then(userInfo => {
        this.props.setUsernameAndEmail(userInfo.username, userInfo.email);
      })
    }

  }
  componentDidMount() {
    console.log("currentUser at mount: ", this.props.currentUser);
  }

  render () {
    return (
      <>
        <div className="App">
            <NavBar/>
        </div>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/play' component={Play}/>
        <Route exact path='/scoreboard' render={notImpl}/>
        <Route exact path='/discover' render={notImpl}/>
        <Route exact path='/profile' component={Profile}/>
        <Route exact path='/logout' render={logoutRender}/>
        <Route exact path='/signup' component={Signup}/>
        <Route exact path='/' render={this.renderLoginOrHome}/>
      </>
    );

  }
}

// function currentUserReducer(state: any, action: string): string {
//   switch(action) {
//     case ''
//   }
// }

// Don't know the types yet.
const mapStateToProps = (state: any) => {
  return {
    currentUser: state.currentUser,
    username: state.username,
    email: state.email
  }
}

// const mapDispatchToProps = (dispatch: any): any => {
//   return {
//     setUsernameAndEmail: (username: string, email: string) => dispatch(setUsernameAndEmail(username, email))
//   }
// }
// Bizarrely this works instead of mapDispatchToProps
// Thanks to: https://stackoverflow.com/questions/53994860/mapdispatchtoprops-causes-typescript-error-in-parent-component-expecting-action
export const App = connect(mapStateToProps, {setUsernameAndEmail})(_App);
