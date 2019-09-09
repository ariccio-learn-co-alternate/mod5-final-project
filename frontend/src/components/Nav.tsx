import React, {FunctionComponent} from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import NavItem from 'react-bootstrap/NavItem';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

type NavBarProps = {
    currentUser: string
}
const UserNav: FunctionComponent<{}> = () =>
    <Navbar bg="light" variant="dark" expand="lg">
        {/* NOTE TO SELF: WHY DID THIS BREAK WITHOUT NAVBAR.COLLAPSE? */}
        <Navbar.Collapse>
            <Nav variant="tabs" >
                <LinkContainer to='/play'><NavItem className='nav-item'>Play </NavItem></LinkContainer> 
                <LinkContainer to='/scoreboard'><NavItem className='nav-item'>Scoreboard </NavItem></LinkContainer> 
                <LinkContainer to='/discover'><NavItem className='nav-item'>Discover </NavItem></LinkContainer> 
                <LinkContainer to='/profile'><NavItem className='nav-item'>Profile </NavItem></LinkContainer> 
                <LinkContainer to='/logout'><NavItem className='nav-item'>Logout</NavItem></LinkContainer>
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