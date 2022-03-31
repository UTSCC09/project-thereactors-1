import './ProfilePage.scss';
import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Avatar,
    IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { cloneDeep } from 'lodash';
import * as UserAPI from 'api/user';
import * as AuthAPI from 'auth/auth_utils.js';

export default function ProfilePage() {
    const [theme, setTheme] = useState('');
    const [user, setUser] = useState({});
    const [newUser, setNewUser] = useState({username:"", email:"", password:""});
    const [originalAvatar, setOriginalAvatar] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarChanged, setAvatarChanged] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setTheme(localStorage.getItem('theme'));
        }
        document.addEventListener('themeChange', () => {
            setTheme(localStorage.getItem('theme'));
        });

        // API call to get user data
        UserAPI.getUserByUsername(AuthAPI.getUser(), (err, res) => {
            if (err) { console.log(err) }
            if (!err) {
                let temp = res[0];
                temp.password = "";
                setUser(temp);
                setNewUser(temp);
            }
        })

        UserAPI.getAvatar(AuthAPI.getUser(), (avatar) => {
            setAvatarPreview(avatar);
            setOriginalAvatar(avatar);
        })
    }, []);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const changeField = (e, field) => {
        let temp  = cloneDeep(newUser);
        temp[field] = e.target.value;
        setNewUser(temp);
    }

    const onAvatarChange = (e) => {
        const avatar = e.target.files[0];
        setAvatar(avatar);
        setAvatarChanged(true);
        const reader = new FileReader();
        reader.readAsDataURL(avatar);
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
    }

    const handleSave = (e) => {
        e.preventDefault();
        if (!validateEmail(newUser.email)) {
            document.getElementById('warning').style.display = 'block';
            document.getElementById('warning').innerHTML = "Invalid email address!";
            setTimeout(() => {
                document.getElementById('warning').style.display = 'none';
            }, 5000)
        }
        else if (isChangePassword && newUser.password !== confirmPassword) {
            document.getElementById('warning').style.display = 'block';
            document.getElementById('warning').innerHTML = "Password doesn't match!";
            setTimeout(() => {
                document.getElementById('warning').style.display = 'none';
            }, 5000)
        }
        else {
            // API call to update user data
            // console.log(newUser)
            let reqBody = {email: newUser.email, password: newUser.password};
            UserAPI.updateUser(newUser.username, reqBody, (err, res) => {
                if (err) {
                    console.log(err)
                }
                else if (avatarChanged) {
                    // console.log(avatar);
                    UserAPI.updateAvatar(avatar, (err, res) => {
                        if (err) console.log(err);
                        else window.location.reload(false);
                    });
                }
                else {
                    window.location.reload(false);
                }
            });
        }
    }

    const handleCancel = () => {
        setNewUser(user);
        setAvatarPreview(originalAvatar);
        setIsEdit(false);
        setIsChangePassword(false);
        setConfirmPassword('');
    }

    return (
        <div className="profile-page">
            <div className={theme === 'dark' ? 'user-info-box box-common-dark' : 'user-info-box'}>
                <div className='header1'>
                    <EditIcon style={{visibility:'hidden'}}/>
                    <div className='text'>Profile</div>
                    <EditIcon onClick={()=>setIsEdit(true)} style={{visibility: isEdit ? 'hidden' : 'visible'}} />
                </div>
                <form style={{width: '80%'}} onSubmit={(e)=>handleSave(e)}>
                <div className='profilePic-box'>
                    <input
                        id="contained-button-file"
                        type="file"
                        accept="image/*"
                        style={{display:'none'}}
                        onChange={onAvatarChange}
                        disabled={!isEdit}
                    />
                    <label htmlFor="contained-button-file">
                        <IconButton component='span' className='pic-container'>
                        <Avatar
                            src={avatarPreview}
                            className={isEdit ? 'avatar-edit' : 'avatar' }
                        />
                        {isEdit &&
                            <div className="edit-overlay">
                                <EditIcon className='edit-icon' />
                            </div>
                        }
                        </IconButton>
                    </label>
                </div>
                <div className='form-row'>
                <div className='text'>Username:</div>
                <TextField
                    className={theme === 'dark' ? 'textfield textfield-dark' : 'textfield'}
                    size='small'
                    value={newUser.username}
                    onChange={(e)=>changeField(e, 'username')}
                    disabled={true}
                    required
                />
                </div>
                <div className='form-row'>
                <div className='text'>Email:</div>
                <TextField
                    className={theme === 'dark' ? 'textfield textfield-dark' : 'textfield'}
                    size='small'
                    value={newUser.email}
                    type='email'
                    onChange={(e)=>changeField(e, 'email')}
                    disabled={!isEdit}
                    required
                />
                </div>
                {isEdit &&
                    <div className='change-pw-btn' onClick={()=>setIsChangePassword(!isChangePassword)}>Change Password</div>
                }
                {isChangePassword &&
                    <>
                    <div className='form-row'>
                    <div className='text'>New Password:</div>
                    <TextField
                        className={theme === 'dark' ? 'textfield textfield-dark' : 'textfield'}
                        size='small'
                        value={newUser.password}
                        type='password'
                        inputProps={{ minLength: 8 }}
                        onChange={(e)=>changeField(e, 'password')}
                        required
                    />
                    </div>
                    <div className='form-row'>
                    <div className='text'>Confirm Password:</div>
                    <TextField
                        className={theme === 'dark' ? 'textfield textfield-dark' : 'textfield'}
                        size='small'
                        value={confirmPassword}
                        type='password'
                        inputProps={{ minLength: 8 }}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        required
                    />
                    </div>
                    </>
                }
                <div
                    id='warning'
                    style={{display:'none', color:'red',marginTop:6}}
                >
                </div>
                {isEdit &&
                <>
                <Button type='submit' className='btn' variant='outlined' size='small'
                    style={{marginRight: 10}}>Save</Button>
                <Button className='btn' variant='outlined' size='small'
                    onClick={()=>handleCancel()}>Cancel</Button>
                </>
                }
                </form>
            </div>
        </div>
    )
}