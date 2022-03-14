import React from "react";
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import HomePage from "./components/pages/HomePage/HomePage";
import FollowingPage from "./components/pages/FollowingPage/FollowingPage";
import PostRecipePage from "./components/pages/PostRecipePage/PostRecipePage";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import CookingPage from "./components/pages/CookingPage/CookingPage";

import Navbar from "./components/utils/Navbar/Navbar";

export default function Router() {
    return (
        <div>
        <BrowserRouter>
            <Navbar />
            <div className="main-component">
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/following" component={FollowingPage} />
                <Route exact path="/post-recipe" component={PostRecipePage} />
                <Route exact path="/profile" component={ProfilePage} />
                <Route path="/cooking/:id" component={CookingPage} />
                <Route exact path="/*"><Redirect to="/" /></Route>
            </Switch>
            </div>
        </BrowserRouter>
        </div>
    );
}
