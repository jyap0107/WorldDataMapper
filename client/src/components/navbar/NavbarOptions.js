import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem }                from 'wt-frontend';
import { Link } from 'react-router-dom';

const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    const handleLogout = async (e) => {
        await Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.clearStore();
        }
    };

    return (
        <>
        <WNavItem hoverAnimation="lighten">
            <Link className="navbar-options username" wType="texted" hoverAnimation="text-primary" to="/updateAccount">{props.user.name}
            </Link>
        </WNavItem>
        <WNavItem hoverAnimation="lighten">
            <Link to="/welcome">
                <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary">
                    <Link to="/welcome">Logout</Link>
                </WButton>
            </Link>
        </WNavItem >
        </>
    );
};

const LoggedOut = (props) => {
    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <Link className="navbar-options" to="/login">
                    Login
                </Link>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <Link className="navbar-options" to="/createAccount" wType="texted" hoverAnimation="text-primary"> 
                    Sign Up 
                </Link>
            </WNavItem>
        </>
    );
};


const NavbarOptions = (props) => {
    return (
        <>
            {
                props.auth === false ? <LoggedOut setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate} />
                : <LoggedIn user={props.user} fetchUser={props.fetchUser} setActiveList={props.setActiveList} logout={props.logout} handleSetCurrentRegion={props.handleSetCurrentRegion} />
            }
        </>

    );
};

export default NavbarOptions;