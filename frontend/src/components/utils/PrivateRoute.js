import React from 'react';
import * as authAPI from 'auth/auth_utils';
import { Route, Redirect } from 'react-router-dom';
import * as socket_utils from 'components/utils/socket_utils';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    
    <Route {...rest} render={props => {
        const isauthenticated = authAPI.signedIn();
        if (!isauthenticated) {
            // console.log("not auth");
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/sign-in', state: { from: props.location } }} />
        }
        socket_utils.connectToSocket();
        return <Component {...props} />
    }} />
)
