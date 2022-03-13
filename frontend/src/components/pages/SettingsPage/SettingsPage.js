import './SettingsPage.scss';
import React, { useEffect, useState } from "react";

const EDIT_PROFILE = 0;
const CHANGE_PASSWORD = 1;

export default function SettingsPage() {

    useEffect(() => {

    }, []);

    const [activeSettingItem, setActiveSettingItem] = useState(EDIT_PROFILE);

    const changeSettingItem = (setting) => {
        setActiveSettingItem(setting);
    }

    return (
        <div className='settings-page'>
            <div className='side-panel'>
                <div className='setting-item' onClick={()=>changeSettingItem(EDIT_PROFILE)}>Edit Profile</div>
                <div className='setting-item' onClick={()=>changeSettingItem(CHANGE_PASSWORD)}>Change Password</div>
            </div>
            <div className='main-panel'>
                {activeSettingItem === EDIT_PROFILE &&
                    <div className='edit-profile-wrapper'>
                        <div>Edit Profile</div>
                        <div>
                            Username:
                            <input className='form-input'></input>
                        </div>
                        <div>
                            Firstname:
                            <input className='form-input'></input>
                        </div>
                        <div>
                            Lastname:
                            <input className='form-input'></input>
                        </div>
                        <div>
                            Email:
                            <input className='form-input'></input>
                        </div>
                        <button onClick={()=>{}}>Save</button>
                    </div>
                }
                {activeSettingItem === CHANGE_PASSWORD &&
                    <>
                        Change Password
                    </>
                }
            </div>
        </div>
    )
}