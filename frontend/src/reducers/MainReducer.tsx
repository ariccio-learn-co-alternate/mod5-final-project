import {AppState} from '../index'
import {fromLocalStorage, clearLocalStorage} from '../utils/Authentication'
import {
    LOGIN_ACTION,
    SIGNUP_ACTION,
    SET_USERNAME_AND_EMAIL,
    LOGOUT_ACTION,
    SET_USER_SCORES
} from '../Actions';

const initialState: AppState = {
    currentUser: fromLocalStorage(),
    username: '',
    email: '',
    scores: []
}

export function reducer(state: AppState = initialState, action: any): any {
    // console.log(state);
    switch(action.type) {
        case LOGIN_ACTION:
            console.log("login action");
            return {
                ...state,
                currentUser: action.jwt,
                username: action.username,
                email: action.email
            };
        case SIGNUP_ACTION:
            console.log('signup action');
            return {
                ...state,
                currentUser: action.jwt,
                username: action.username,
                email: action.email
            };
        case SET_USERNAME_AND_EMAIL:
            console.log('setting username and email');
            return {
                ...state,
                username: action.username,
                email: action.email
            };
        case SET_USER_SCORES:
            console.log('setting user scores');
            return {
                ...state,
                scores: action.scores
            };
        case LOGOUT_ACTION:
            console.log('clearing stored state...');
            clearLocalStorage();
            return {
                ...state,
                username: action.username,
                email: action.email,
                currentUser: action.currentUser
            };
        default:
            console.log("default action: ", action);
            return {...state};
    }
}
