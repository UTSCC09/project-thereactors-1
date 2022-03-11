import './Navbar.scss';
import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { useHistory } from "react-router-dom";

export default function Navbar() {
    const history = useHistory();

    const redirectToHome = () => {
        history.push("/");
    }

    const redirectToFollowing = () => {
        history.push("/following");
    }

    const redirectToPostRecipe = () => {
        history.push("/post-recipe");
    }

    return (
        <div className='navbar'>
            <div className='left'>
                <div className='title-header' onClick={redirectToHome}>RecipeCentral</div>
            </div>
            <div className='right'>
                <div className='home' onClick={redirectToHome}>home</div>
                <div className='following' onClick={redirectToFollowing}>following</div>
                <div className='post-btn-wrapper'>
                    <button className='post-btn' onClick={redirectToPostRecipe}>post</button>
                </div>
                <div className='search-icon'><SearchIcon /></div>
                <div className='user-icon'><PersonIcon /></div>
            </div>
        </div>
    )
}