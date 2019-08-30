import React, {FunctionComponent} from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import { LinkContainer } from 'react-router-bootstrap';


type NavBarProps = {
    currentUser: string
}


// const UserNav: FunctionComponent<{}> = () => 
//     <>
//         <nav>
//             <ul>
//                 <li><Link to='/play'>Play</Link></li>
//                 <li><Link to='/scoreboard'>Scoreboard</Link></li>
//                 <li><Link to='/discover'>Discover</Link></li>
//                 <li><Link to='/profile'>Profile</Link></li>
//                 <li><Link to='/logout'>Logout</Link></li>
//             </ul>
//         </nav>
//     </>


const UserNav: FunctionComponent<{}> = () =>
    <Navbar bg="light" variant="dark" expand="lg">
        <Navbar.Collapse>
            <Nav variant="tabs" >
                <LinkContainer to='/play'><NavItem>Play </NavItem></LinkContainer>
                <LinkContainer to='/scoreboard'><NavItem>Scoreboard </NavItem></LinkContainer>
                <LinkContainer to='/discover'><NavItem>Discover </NavItem></LinkContainer>
                <LinkContainer to='/profile'><NavItem>Profile </NavItem></LinkContainer>
                <LinkContainer to='/logout'><NavItem>Logout</NavItem></LinkContainer>
            </Nav>
        </Navbar.Collapse>
    </Navbar>

const _NavBar: FunctionComponent<NavBarProps> = (props: NavBarProps) => {
    if (props.currentUser === '') {
        return <Redirect to='/'/>;
    }
    return <UserNav/>;

}

const mapStateToProps = (state: any) => {
    return {
        currentUser: state.currentUser
    }
}

export const NavBar = connect(mapStateToProps, null)(_NavBar);