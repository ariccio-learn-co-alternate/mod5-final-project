
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

export function signUpRequestOptions(name: string, email: string, password: string): RequestInit {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                name,
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

export function login(username: string, password: string): Promise<LoginResponse> {
    const requestOptions: RequestInit = loginRequestOptions(username, password);
    debugger;
    return fetch("/login", requestOptions)
        .then(response => response.json())
        .then(response => {
            // console.log(response);
            // render json: { username: @user.email, jwt: token }, status: :accepted
            console.assert(response != null);
            console.assert(response !== undefined);
            console.assert(response !== "undefined");
            if (response.errors === undefined) {
                console.assert(response.jwt !== undefined)
                localStorage.setItem('currentUser', JSON.stringify(response.jwt))
            }
            return response;
        })
}

export function signup(name: string, username: string, password: string): Promise<SignupResponse> {
    const requestOptions: RequestInit = signUpRequestOptions(name, username, password);
    debugger;
    return fetch("/users", requestOptions)
        .then(response => response.json())
        .then(response => {
            // render json: { jwt: token }, status: :created
            console.assert(response != null);
            console.assert(response !== undefined);
            console.assert(response !== "undefined");
            if (response.errors === undefined) {
                localStorage.setItem('currentUser', JSON.stringify(response.jwt));
            }
            return response;
        })
}
