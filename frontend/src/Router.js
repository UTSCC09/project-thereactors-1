import React from "react";
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import HomePage from "./components/pages/HomePage/HomePage";
import SignInPage from "./components/pages/SignInPage/SignInPage";
import JoinPartyPage from "./components/pages/JoinPartyPage/JoinPartyPage";
import SchedulePartyPage from "./components/pages/SchedulePartyPage/SchedulePartyPage";
import WatchPartyPage from "./components/pages/WatchPartyPage/WatchPartyPage";
import Navbar from "./components/utils/Navbar/Navbar";

export default function Router() {
    return (
        <div style={{height: '100vh'}}>
        <BrowserRouter>
            <Navbar />
            <div className="main-component">
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/sign-in" component={SignInPage} />
                <Route exact path="/join" component={JoinPartyPage} />
                <Route exact path="/schedule" component={SchedulePartyPage} />
                <Route exact path="/party" component={WatchPartyPage} />
                <Route exact path="/*"><Redirect to="/" /></Route>
            </Switch>
            </div>
        </BrowserRouter>
        </div>
    );
}
