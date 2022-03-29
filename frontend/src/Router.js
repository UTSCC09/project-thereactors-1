import React from "react";
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import HomePage from "./components/pages/HomePage/HomePage";
import SignInPage from "./components/pages/SignInPage/SignInPage";
import SignUpPage from "components/pages/SignInPage/SignUpPage";
import JoinPartyPage from "./components/pages/JoinPartyPage/JoinPartyPage";
import CreatePartyPage from "./components/pages/CreatePartyPage/CreatePartyPage";
import WatchPartyPage from "./components/pages/WatchPartyPage/WatchPartyPage";
import Navbar from "./components/utils/Navbar/Navbar";
import ProfilePage from "components/pages/ProfilePage/ProfilePage";
import { PrivateRoute } from "components/utils/PrivateRoute";

export default function Router() {
    return (
        <div style={{height: '100vh'}}>
        <BrowserRouter>
            <Navbar />
            <div className="main-component">
            <Switch>
                <PrivateRoute exact path="/" component={HomePage} />
                <Route exact path="/sign-in" component={SignInPage} />
                <Route exact path="/sign-up" component={SignUpPage} />
                <PrivateRoute exact path="/join" component={JoinPartyPage} />
                <PrivateRoute exact path="/party" component={WatchPartyPage} />
                <PrivateRoute exact path="/create" component={CreatePartyPage}/>
                <PrivateRoute exact path="/profile" component={ProfilePage}/>
                <Route exact path="/*"><Redirect to="/" /></Route>
            </Switch>
            </div>
        </BrowserRouter>
        </div>
    );
}
