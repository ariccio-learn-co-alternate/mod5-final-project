import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
// import { switchStatement } from '@babel/types';

import {AppState} from './index'
import {Login} from './components/Login';
import {Signup} from './components/Signup';
import './App.css';
import {clearLocalStorage} from './utils/Authentication';
import {NavBar} from './components/Nav'

export interface AppProps {
  // Nothing yet
  currentUser: string
}

const notImpl = () => 
  <h1>notimpl</h1>


const logoutRender = () => {
  clearLocalStorage();
  return (
    renderLogin()
  );
}

const renderLogin = () => {
  return( <><Redirect to='/login'/></>);
}
export class App extends React.Component<AppProps, AppState> {
  renderLoginOrHome = () => {
    if (this.props.currentUser === '') {
      console.log("No cached creds");
      return renderLogin();
    }

  }
  componentDidMount() {

  }

  render () {
    return (
      <>
        <div className="App">
            <NavBar/>
        </div>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/play' render={notImpl}/>
        <Route exact path='/scoreboard' render={notImpl}/>
        <Route exact path='/discover' render={notImpl}/>
        <Route exact path='/profile' render={notImpl}/>
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
    currentUser: state.currentUser
  }
}


export default connect(mapStateToProps, null)(App);
