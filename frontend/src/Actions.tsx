export const LOGIN_ACTION = 'LOGIN';

export function loginUser(username: string, password: string): object {
    return {
        type: LOGIN_ACTION,
        username: username,
        password: password
    }
}