import React from 'react';
import * as authAPI from 'auth/auth_utils';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    
    <Route {...rest} render={props => {
        const isauthenticated = authAPI.getToken();
        console.log(authAPI.getToken());
        console.log(isauthenticated);
        if (!isauthenticated) {
            // console.log("not auth");
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/sign-in', state: { from: props.location } }} />
        }

        return <Component {...props} />
    }} />
)
