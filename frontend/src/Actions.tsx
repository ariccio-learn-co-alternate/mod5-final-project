export const LOGIN_ACTION = 'LOGIN';

export function loginUser(username: string, password: string): object {
    return {
        type: LOGIN_ACTION,
        username: username,
        password: password
    }
}

export const SIGNUP_ACTION = 'SIGNUP';

export function signupUser(username: string, email: string, password: string): object {
    return {
        type: SIGNUP_ACTION,
        username: username,
        email: email,
        password: password
    }
}