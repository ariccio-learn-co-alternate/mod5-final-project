import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import { createReducer } from 'typesafe-actions';
import {BrowserRouter} from 'react-router-dom';

import App from './App';
import {fromLocalStorage} from './utils/Authentication'

// Should be a DeepReadonly?
export interface AppState {
    readonly currentUser: string;
}
  
const initialState: AppState = {
    currentUser: fromLocalStorage()
}
  
  
function reducer(state: AppState = initialState, action: any): any {
    console.log(state);
    switch(action.type) {
        case "LOGIN":
            console.log("login action");
            return {
                ...state,
                currentUser: action.user
        }
        default:
            console.log("default action: ", action);
            return {...state};
    }
}
  
const store = createStore(reducer);
  
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
