import React from 'react'
import { connect } from 'react-redux';

import {formatErrors} from '../utils/ErrorObject';

function scoreboardOptions(jwt: string): RequestInit {
    const requestOptions = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`

        },
    }
    return requestOptions;
}

// function itemsRender (items: Array<any>) {
//     return (
//         <>
//             {items.map((item: any) => <p>{item}</p>)}
//         </>
//     );
// }

type score = {
    user: string,
    score: string,
    level: string
}

interface ScoreboardState {
    response: Array<score>
}

interface ScoreboardProps {
    currentUser: string
}

const initScoreboardState: ScoreboardState = {
 
    response: [{
        user: '',
        score: '',
        level: ''
    }]
}


class _Scoreboard extends React.Component<ScoreboardProps, ScoreboardState> {
    state = initScoreboardState
    async componentDidMount() {
        const rawResponse: Promise<Response> = fetch('/scoreboard', scoreboardOptions(this.props.currentUser));
        const jsonResponse = (await rawResponse).json();
        const response = await jsonResponse;
        if (response.errors !== undefined) {
            console.error(formatErrors(response.errors));
            alert(formatErrors(response.errors));
            return;
        }
        // debugger;
        this.setState({response: response.scores});
    }

    render() {

        // debugger;
        // return itemsRender(response);
        // debugger;
        console.log(this.state.response);
        return (
            <p>{
                this.state.response.map(score => {
                    return (
                        <p>
                            {score.user},
                            {score.score},
                            {score.level}
                        </p>
                    );
                })
            }</p>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
      currentUser: state.currentUser,
    }
  }
  

export const Scoreboard = connect(mapStateToProps, {})(_Scoreboard);