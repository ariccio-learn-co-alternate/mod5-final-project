import React from 'react';
import {BrowserRouter, Route, Link, Redirect} from 'react-router-dom';
import { connect, Provider } from 'react-redux';
// import { switchStatement } from '@babel/types';

import {AppProps, AppState} from './index'
import {Login} from './components/Login';
import './App.css';
import './utils/Authentication';


export class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    currentUser: null
  }

  renderLoginOrHome = () => {
    if (this.state.currentUser === null) {
      console.log("No cached creds");
      return (
        <>
          <Redirect to='/login'/>
        </>
      )
    }
  }
  render () {
    return (
      <div className="App">
        <BrowserRouter>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/' render={this.renderLoginOrHome}/>
        </BrowserRouter>
      </div>
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
