import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
// import { switchStatement } from '@babel/types';
import './App.css';

import {queryUserInfo} from './utils/QueryUserInfo'

import {AppState} from './index'
import {Login} from './components/Login';
import {Signup} from './components/Signup';
import {Play} from './components/Play';
import {NavBar} from './components/Nav'
import {Profile} from './components/Profile'
import {Scoreboard} from './components/Scoreboard'

import {setUsernameAndEmail, logoutUser} from './Actions'

interface AppProps {
  // Nothing yet
  currentUser: string,
  username: string,
  email: string,
  setUsernameAndEmail: any,
  logoutUser: any
}

const notImpl = () => 
  <h1>Not implemented.</h1>



const renderLogin = () => {
  return( <><Redirect to='/login'/></>);
}
class _App extends React.Component<AppProps, AppState> {

  logoutRender = () => {
    this.props.logoutUser();
    return (
      renderLogin()
    );
  }
  

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

  routes = () => {
    return (
      <>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/play' component={Play}/>
        <Route exact path='/scoreboard' component={Scoreboard}/>
        <Route exact path='/discover' render={notImpl}/>
        <Route exact path='/profile' component={Profile}/>
        <Route exact path='/logout' render={this.logoutRender}/>
        <Route exact path='/signup' component={Signup}/>
        <Route exact path='/' render={this.renderLoginOrHome}/>
      </>
    );
  }

  render () {
    return (
      <>
        <div className="App">
            <NavBar/>
        </div>
        {this.routes()}
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
export const App = connect(mapStateToProps, {setUsernameAndEmail, logoutUser})(_App);
