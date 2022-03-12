import './ProfilePage.scss';
import React, { useEffect } from "react";

export default function ProfilePage() {
    
    useEffect(() => {

    }, []);

    return (
        <div className='profile-page'>
            <div className='info-section'>
                <div className='col1'>
                    <img alt='John Smith' src='https://180dc.org/wp-content/uploads/2016/08/default-profile.png' />
                </div>
                <div className='col2'>
                    <div className='row1 row'>
                        <div className='fullname col1-1'><b>John Smith</b></div>
                        <button>follow</button>
                    </div>
                    <div className='row2 row'>
                        <div>recipes 2</div>
                        <div>followers 2</div>
                        <div>following 0</div>
                    </div>
                    <div className='bio row'>
                        Bio:
                        <div className='bio-box'>
                            im john smith, blah blah!!
                        </div>
                    </div>
                    <div>Rank: Intermediate</div>
                </div>
            </div>
            <div className='feed-section'>

            </div>
        </div>
    )
}