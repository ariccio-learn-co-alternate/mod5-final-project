import React from 'react';
import {BrowserRouter, Route, Link, Redirect} from 'react-router-dom';
import {Login} from './components/Login';
import './App.css';
import './utils/Authentication'


interface AppState {
  currentUser: string | null;
}

interface AppProps {
  // Nothing yet
}

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

export default App;
