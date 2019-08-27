import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

type NavBarProps = {

}

export const NavBar: FunctionComponent<NavBarProps> = (props: NavBarProps) =>
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