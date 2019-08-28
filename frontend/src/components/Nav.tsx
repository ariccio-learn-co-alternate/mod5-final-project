import React, {FunctionComponent} from 'react';
import { connect } from 'react-redux';
import {Link, Redirect} from 'react-router-dom';

type NavBarProps = {
    currentUser: string
}


const UserNav: FunctionComponent<{}> = () => 
    <>
        <li><Link to='/play'>Play</Link></li>
        <li><Link to='/scoreboard'>Scoreboard</Link></li>
        <li><Link to='/discover'>Discover</Link></li>
        <li><Link to='/profile'>Profile</Link></li>
        <li><Link to='/logout'>Logout</Link></li>
    </>

const _NavBar: FunctionComponent<NavBarProps> = (props: NavBarProps) => {
    if (props.currentUser === '') {
        return <Redirect to='/'/>;
    }
    return (
        <>
            <nav>
                <ul>
                    <li><Link to='/play'>Play</Link></li>
                    <li><Link to='/scoreboard'>Scoreboard</Link></li>
                    <li><Link to='/discover'>Discover</Link></li>
                    <li><Link to='/profile'>Profile</Link></li>
                    <li><Link to='/logout'>Logout</Link></li>
                </ul>
            </nav>
        </>
    );

}

const mapStateToProps = (state: any) => {
    return {
        currentUser: state.currentUser
    }
}

export const NavBar = connect(mapStateToProps, null)(_NavBar);