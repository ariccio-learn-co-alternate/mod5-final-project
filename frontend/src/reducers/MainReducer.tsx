import {AppState} from '../index'
import {fromLocalStorage} from '../utils/Authentication'
import {LOGIN_ACTION, SIGNUP_ACTION, SET_USERNAME_AND_EMAIL} from '../Actions';

const initialState: AppState = {
    currentUser: fromLocalStorage(),
    username: '',
    email: ''
}

export function reducer(state: AppState = initialState, action: any): any {
    console.log(state);
    switch(action.type) {
        case LOGIN_ACTION:
            console.log("login action");
            return {
                ...state,
                currentUser: action.jwt,
                username: action.username,
                email: action.email
        }
        case SIGNUP_ACTION:
            console.log('signup action');
            return {
                ...state,
                currentUser: action.jwt,
                username: action.username,
                email: action.email
            }
        case SET_USERNAME_AND_EMAIL:
            console.log('setting username and email');
            return {
                ...state,
                username: action.username,
                email: action.email
            }
        default:
            console.log("default action: ", action);
            return {...state};
    }
}
