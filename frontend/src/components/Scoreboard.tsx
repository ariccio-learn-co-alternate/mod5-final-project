import React from 'react'
import Table from 'react-bootstrap/Table'
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

type score = {
    user: string,
    user_id: string,
    score: string,
    level: string
}

interface ScoreboardState {
    readonly responseTopTen: Array<score>,
    readonly scores_friend_top_ten: Array<score>
}

interface ScoreboardProps {
    currentUser: string
}

const initScoreboardState: ScoreboardState = {
    responseTopTen: [{
        user: '',
        user_id: '',
        score: '',
        level: ''
    }],
    scores_friend_top_ten: [{
        user: '',
        user_id: '',
        score: '',
        level: ''
    }]

}

const tableHeader = () => 
    <thead>
        <tr>
            <th>#</th>
            <th>username</th>
            <th>score</th>
            <th>level</th>
            <th>time</th>
        </tr>
    </thead>

function rowKey(score: any): string {
    return `scoreboard-entry-key-user-${score.user_id}-level-${score.level}-score-${score.score}-${score.time}`;
}

function rowKeyFriend(score: any): string {
    return `scoreboard-friend-entry-key-user-${score.user_id}-level-${score.level}-score-${score.score}-${score.time}`;
}

const tableRow = (score: any, index: number) =>
        <tr key={rowKey(score)}>
            <td>{index}</td>
            <td>{score.user}</td>
            <td>{score.score}</td>
            <td>{score.level}</td>
            <td>{score.time}</td>
        </tr>

const tableFriendRow = (score: any, index: number) =>
        <tr key={rowKeyFriend(score)}>
            <td>{index}</td>
            <td>{score.user_id}</td>
            <td>{score.score}</td>
            <td>{score.level_id}</td>
            <td>{score.time}</td>
        </tr>


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
        if (response.scores_top_ten_all === undefined) {
            console.error('bad server data');
            this.setState({
                responseTopTen: initScoreboardState.responseTopTen,
                scores_friend_top_ten: response.scores_friend_top_ten
            })
            return;
        }
        else if (response.scores_friend_top_ten === undefined) {
            console.error('bad server data');
            this.setState({
                responseTopTen: response.scores_top_ten_all,
                scores_friend_top_ten: initScoreboardState.scores_friend_top_ten
            })
            return;
        }
        this.setState({
            responseTopTen: response.scores_top_ten_all,
            scores_friend_top_ten: response.scores_friend_top_ten
        });
    }

    tenTable = (scoresHash: any) =>
            <>
                <Table striped bordered hover>
                    {tableHeader()}
                    <tbody>
                        {scoresHash.map((score: any, index: number) => {return tableRow(score, index)})}
                    </tbody>
                </Table>
            </>


// created_at: "2019-09-09T19:35:56.099Z"
// id: 20
// level_id: 1
// score: 5
// updated_at: "2019-09-09T19:35:56.099Z"
// user_id: 7
    friendTable = (scores: any) => 
        <>
            <Table striped bordered hover>
            {tableHeader()}
                    <tbody>
                        {scores.map((score: any, index: number) => {return tableFriendRow(score, index)})}
                    </tbody>

            </Table>
        </>

    render = () =>
        <>
            <h1>Top ten scores:</h1>
            {this.tenTable(this.state.responseTopTen)}
            <h1>Friend scores</h1>
            {this.friendTable(this.state.scores_friend_top_ten)}
        </>
}

const mapStateToProps = (state: any) => {
    return {
      currentUser: state.currentUser,
    }
  }

export const Scoreboard = connect(mapStateToProps, {})(_Scoreboard);