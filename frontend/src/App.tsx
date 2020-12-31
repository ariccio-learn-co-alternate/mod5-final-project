import React, { useEffect } from 'react';
import {Route, Redirect} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {queryUserInfo} from './utils/QueryUserInfo'

import {AppState} from './index'
import {Login} from './components/Login';
import {Signup} from './components/Signup';
import {Play} from './components/Play';
import {NavBar} from './components/Nav'
import {Profile} from './components/Profile'
import {Scoreboard} from './components/Scoreboard';
import {Discover} from './components/Discover';
import {setUsernameAndEmail, logoutUser} from './Actions';

import './App.css';

interface AppProps {
    // Nothing yet
    // currentUser: string,
    // username: string,
    // email: string,
    // setUsernameAndEmail: any,
    // logoutUser: any
}

const routes = (logoutRender: (() => JSX.Element), renderLoginOrHome: (() => JSX.Element)) =>
    <>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/play' component={Play}/>
        <Route exact path='/scoreboard' component={Scoreboard}/>
        <Route exact path='/discover' component={Discover}/>
        <Route exact path='/profile' component={Profile}/>
        <Route exact path='/logout' render={logoutRender}/>
        <Route exact path='/signup' component={Signup}/>
        <Route exact path='/' render={renderLoginOrHome}/>
    </>


const renderLogin = () =>
    <Redirect to='/login'/>

const logoutRender = (dispatch: any): JSX.Element => {
    dispatch(logoutUser());
    return (
        renderLogin()
    );
}

//this.props.setUsernameAndEmail
const checkEmptyUsernameOrEmail = (currentUser: string, username: string, email: string, dispatch: any): void => {
    if (currentUser === '') {
        // another function needs to handle that.
        return;
    }
    if ((username === '') || (email === '') ) {
        console.log('username or email empty.');
        //const userInfo = await queryUserInfo(this.props.currentUser)
        queryUserInfo(currentUser).then(userInfo => {
            if (userInfo.user_info === undefined) {
                console.log('undefined user_info');
                return; 
            }
            console.log("setting username and email: ", userInfo);
            // debugger;
            dispatch(setUsernameAndEmail(userInfo.user_info.username, userInfo.user_info.email));
        })
    }
}

//setUsernameAndEmail: ((username: string, email: string) => object)
const renderLoginOrHome = (currentUser: string, username: string, email: string, dispatch: any) => {
    if (currentUser === '') {
        console.log("No cached credentials");
        return renderLogin();
    }
    checkEmptyUsernameOrEmail(currentUser, username, email, dispatch);
    const redirect = <Redirect to="/play"/>;
    return redirect;
}


export const App: React.FC<AppProps> = (props) => {
    const currentUser = useSelector((state: any) => state.currentUser);
    const username = useSelector((state:any) => state.username);
    const email = useSelector((state: any) => state.email);
    const dispatch = useDispatch();
    useEffect(() => {
        checkEmptyUsernameOrEmail(currentUser, username, email, dispatch);
        }
    );
    
    return (
        <>
            <div className="App">
                <NavBar/>
            </div>
            {routes((() => logoutRender(dispatch)), (() => renderLoginOrHome(currentUser, username, email, dispatch)))}
          </>
    );
}

// const mapStateToProps = (state: any) => {
//     return {
//         currentUser: state.currentUser,
//         username: state.username,
//         email: state.email
//     }
// }

// const mapDispatchToProps = (dispatch: any): any => {
//   return {
//     setUsernameAndEmail: (username: string, email: string) => dispatch(setUsernameAndEmail(username, email))
//   }
// }
// Bizarrely this works instead of mapDispatchToProps
// Thanks to: https://stackoverflow.com/questions/53994860/mapdispatchtoprops-causes-typescript-error-in-parent-component-expecting-action
// export const App = connect(mapStateToProps, {setUsernameAndEmail, logoutUser})(_App);
