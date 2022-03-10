import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import HomePage from "./components/pages/HomePage/HomePage";
import FollowingPage from "./components/pages/FollowingPage/FollowingPage";
import PostRecipePage from "./components/pages/PostRecipePage/PostRecipePage";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/*" element={<Navigate replace to="/" />} />
                <Route path="/following" element={<FollowingPage />} />
                <Route path="/post-recipe" element={<PostRecipePage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
}
