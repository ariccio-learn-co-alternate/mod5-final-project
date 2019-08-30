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
    responseTopTen: Array<score>
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
    }]
}

const tableHeader = () => 
    <thead>
        <tr>
            <th>#</th>
            <th>username</th>
            <th>score</th>
            <th>level</th>
        </tr>
    </thead>

function rowKey(score: any): string {
    return `scoreboard-entry-key-user-${score.user_id}-level-${score.level}-score-${score.score}`;
}
function tableRow(score: any, index: number) {
    return (
        <tr key={rowKey(score)}>
            <td>{index}</td>
            <td>{score.user}</td>
            <td>{score.score}</td>
            <td>{score.level}</td>
        </tr>
    );
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
        this.setState({
            responseTopTen: response.scores_top_ten_all
        });
    }

    table() {
        return (
            <>
                <Table striped bordered hover>
                    {tableHeader()}
                    <tbody>
                        {this.state.responseTopTen.map((score, index) => {return tableRow(score, index)})}
                    </tbody>
                </Table>
            </>
        );
    }

    render() {
        return (
            <>
                <h1>Top ten scores:</h1>
                {this.table()}
            </>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
      currentUser: state.currentUser,
    }
  }

export const Scoreboard = connect(mapStateToProps, {})(_Scoreboard);