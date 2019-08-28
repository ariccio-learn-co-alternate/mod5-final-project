export const LOGIN_ACTION = 'LOGIN';
export const SET_USERNAME_AND_EMAIL = 'SET_USERNAME_AND_EMAIL';
export const SIGNUP_ACTION = 'SIGNUP';

export function loginUser(username: string, email: string, jwt: string): object {
    return {
        type: LOGIN_ACTION,
        username: username,
        email: email,
        jwt: jwt
    }
}


export function signupUser(username: string, email: string, jwt: string): object {
    return {
        type: SIGNUP_ACTION,
        username: username,
        email: email,
        jwt: jwt
    }
}


export function setUsernameAndEmail(username: string, email: string): object {
    return {
        type: SET_USERNAME_AND_EMAIL,
        username: username,
        email: email
    }
}