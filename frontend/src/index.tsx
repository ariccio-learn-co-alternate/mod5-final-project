import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {App} from './App';
import {reducer} from './reducers/MainReducer';

import './index.css';
import * as serviceWorker from './serviceWorker';

// Should be a DeepReadonly?
export interface AppState {
    readonly currentUser: string,
    readonly username: string,
    readonly email: string,
    readonly scores: object[],
    currentScore: number
}

export const store = createStore(reducer);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
