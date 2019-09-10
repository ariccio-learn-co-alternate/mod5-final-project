
export const LOGIN_ACTION = 'LOGIN';
export const SET_USERNAME_AND_EMAIL = 'SET_USERNAME_AND_EMAIL';
export const SIGNUP_ACTION = 'SIGNUP';
// export const GET_USER_INFO = 'GET_USER_INFO';
export const LOGOUT_ACTION = 'LOGOUT';
export const SET_USER_SCORES = 'SET_SCORES';
export const SET_CURRENT_SCORE = 'SET_CURRENT_SCORE';
export const SET_PLAYING = 'SET_PLAYING';
export const SET_CURRENT_LEVEL = 'SET_CURRENT_LEVEL';
export const SET_MAX_SCORE_FOR_LEVEL = 'SET_MAX_SCORE_FOR_LEVEL';

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

export function logoutUser(): object {
    return {
        type: LOGOUT_ACTION,
        username: '',
        email: '',
        currentUser: ''
    }
}

export function setUserScores(scores: object[]): object {
    return {
        type: SET_USER_SCORES,
        scores: scores
    }
} 

export function setCurrentScore(score: number): object {
    // console.log("setCurrentScore");
    // debugger;
    return {
        type: SET_CURRENT_SCORE,
        currentScore: score
    }
}

export function setPlaying(playing: boolean): object {
    return {
        type: SET_PLAYING,
        playing: playing
    }
}

export function setCurrentLevel(level: string): object {
    return {
        type: SET_CURRENT_LEVEL,
        currentLevel: level
    }
}

export function setMaxScoreForLevel(maxScore: number): object {
    return {
        type: SET_MAX_SCORE_FOR_LEVEL,
        maxScore: maxScore
    }
}
// export function getUserInfo()