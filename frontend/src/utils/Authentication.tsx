import {formatErrors} from './ErrorObject';
// interface HeaderType {
//     'Content-Type' : String
// }

// export interface RequestOptions {
//     method: String;
//     headers: HeaderType;
//     body: String; // JSON.stringify
// }

export function loginRequestOptions(username: string, password: string): RequestInit {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                username,
                password
            }
        })
    }
    return requestOptions;
}

export function signUpRequestOptions(username: string, email: string, password: string): RequestInit {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                username,
                email,
                password
            }
        })
    }
    return requestOptions;
}

// Very helpful:
// https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example#authentication-service-js
// Return String is jwt token 
export function fromLocalStorage(): string {
    const item: string | null = localStorage.getItem('currentUser');
    if ((item === null) || (item === undefined) || (item === "undefined")) {
        console.log('No cached login creds.');
        return '';
    }
    const parsed = JSON.parse(item);
    return parsed;
}

export function clearLocalStorage(): void {
    // https://developer.mozilla.org/en-US/docs/Web/API/Storage/clear
    localStorage.clear();
}

export interface LoginResponse {
    username: string;
    jwt: string;
}

export interface SignupResponse {
    jwt: string;
}

export async function login(username: string, password: string): Promise<void> {
    const requestOptions: RequestInit = loginRequestOptions(username, password);
    const rawFetchResponse: Promise<Response> = fetch("/login", requestOptions);
    const jsonResponse: Promise<any> = (await rawFetchResponse).json();
    const response = await jsonResponse;
    // console.log(response);
    // render json: { username: @user.email, jwt: token }, status: :accepted
    console.assert(response != null);
    console.assert(response !== undefined);
    console.assert(response !== "undefined");
    if (response.errors === undefined) {
        console.assert(response.jwt !== undefined);
        localStorage.setItem('currentUser', JSON.stringify(response.jwt));
    }
    else {
        console.error(formatErrors(response.errors));
        alert(formatErrors(response.errors));
    }
}

export async function signup(username: string, email: string, password: string): Promise<void> {
    const requestOptions: RequestInit = signUpRequestOptions(username, email, password);
    const rawFetchResponse: Promise<Response> = fetch("/users", requestOptions);
    const jsonResponse: Promise<any> = (await rawFetchResponse).json();
    const response = await jsonResponse;
    // render json: { jwt: token }, status: :created
    console.assert(response != null);
    console.assert(response !== undefined);
    console.assert(response !== "undefined");
    if (response.errors === undefined) {
        localStorage.setItem('currentUser', JSON.stringify(response.jwt));
    }
    else {
        console.error(formatErrors(response.errors));
        alert(formatErrors(response.errors))
    }
    return response;
}
