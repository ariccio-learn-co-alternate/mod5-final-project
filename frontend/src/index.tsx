import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import { createReducer } from 'typesafe-actions';

// Should be a DeepReadonly?
export interface AppState {
    readonly currentUser: string | null;
}
  
const initialState: AppState = {
    currentUser: null
}
  
export interface AppProps {
    // Nothing yet
}
  
function reducer(state: AppState = initialState, action: any): any {
    switch(action.type) {
      case "LOGIN":
        return {
          ...state,
          currentUser: action.user
        }
        default:
          console.assert(false);
          return {...state};
    }
}
  
const store = createStore(reducer);
  
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
