import React from 'react';
import logo from './logo.svg';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import './App.css';
import './utils/Authentication'

interface AppState {
  currentUser: string;
}

interface AppProps {
  // Nothing yet
}

export class App extends React.Component<AppProps, AppState> {

  
  render () {
    return (
      <div className="App">
        <BrowserRouter>
          <Route exact path='/' render={this.renderLoginOrHome}/>
        </BrowserRouter>
      </div>
    );

  }
}

export default App;
