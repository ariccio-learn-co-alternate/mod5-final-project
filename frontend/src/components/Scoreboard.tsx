import React, {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';

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

interface ScoreboardProps {
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
            <td>{score.username}</td>
            <td>{score.score}</td>
            <td>{score.level_id}</td>
            <td>{score.time}</td>
        </tr>


// created_at: "2019-09-09T19:35:56.099Z"
// id: 20
// level_id: 1
// score: 5
// updated_at: "2019-09-09T19:35:56.099Z"
// user_id: 7
const friendTable = (scores: any) => 
    <>
        <Table striped bordered hover>
        {tableHeader()}
                <tbody>
                    {scores.map((score: any, index: number) => {return tableFriendRow(score, index)})}
                </tbody>

        </Table>
    </>

const tenTable = (scoresHash: any) =>
    <>
        <Table striped bordered hover>
            {tableHeader()}
            <tbody>
                {scoresHash.map((score: any, index: number) => {return tableRow(score, index)})}
            </tbody>
        </Table>
    </>


const fetchScoreboard = async (
    setResponseTopTen: React.Dispatch<React.SetStateAction<Array<score>>>,
    setscores_friend_top_ten: React.Dispatch<React.SetStateAction<Array<score>>>,
    currentUser: string) => {
        console.error("note to self, there's something wrong with the friends display. It seems to show duplicates.")
        const rawResponse: Promise<Response> = fetch('/scoreboard', scoreboardOptions(currentUser));
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
            setscores_friend_top_ten(response.scores_friend_top_ten);
            return;
        }
        else if (response.scores_friend_top_ten === undefined) {
            console.error('bad server data');
            setResponseTopTen(response.scores_top_ten_all);
            setscores_friend_top_ten(Array<score>());
            return;
        }
        
        setResponseTopTen(response.scores_top_ten_all);
        setscores_friend_top_ten(response.scores_friend_top_ten);

}

export const Scoreboard : React.FC<ScoreboardProps> = () => {
    const [responseTopTen, setResponseTopTen] = useState(Array<score>());
    const [scores_friend_top_ten, setscores_friend_top_ten] = useState(Array<score>());
    const currentUser = useSelector((state: any) => state.currentUser);

    useEffect(() => {
        fetchScoreboard(setResponseTopTen, setscores_friend_top_ten, currentUser);
        }, []);

    return (
        <>
            <h1>Top ten scores:</h1>
            {tenTable(responseTopTen)}
            <h1>Friend scores</h1>
            {friendTable(scores_friend_top_ten)}
        </>
    );
}
