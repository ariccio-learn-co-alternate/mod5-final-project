
export function userRequestOptions(jwt: string): RequestInit {
    const requestOptions = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
    }
    return requestOptions;
}


export async function queryUserInfo(jwt: string) {
    const rawResponse: Promise<Response> = fetch('/users/show', userRequestOptions(jwt));
    // console.log("body: ", (await rawResponse).body)
    const awaitedResponse = await rawResponse;
    debugger;

    const jsonResponse = awaitedResponse.json();
    const response = await jsonResponse;
    console.log(response);
    return response;
} 