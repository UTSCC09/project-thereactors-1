import './SignInPage.scss';
import React, { useEffect, useState } from "react";
import { 
    Button,
    TextField,
    Avatar,
    IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useHistory } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import * as UserAPI from 'api/user';

const defaultUser = {
    username: "",
    email: "",
    password: "",
    profileLink: "https://180dc.org/wp-content/uploads/2016/08/default-profile.png"
}

export default function SignUpPage() {
    const history = useHistory();
    const [newUser, setNewUser] = useState(defaultUser);
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {

    }, []);

    const toSignIn = () => {
        history.push('sign-in');
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const signUp = (e) => {
        e.preventDefault();
        if (!validateEmail(newUser.email)) {
            document.getElementById('warning').style.display = 'block';
            document.getElementById('warning').innerHTML = "Invalid email address!";
            setTimeout(() => {
                document.getElementById('warning').style.display = 'none';
            }, 5000)
        }
        else if (newUser.password !== confirmPassword) {
            document.getElementById('warning').style.display = 'block';
            document.getElementById('warning').innerHTML = "Password doesn't match!";
            setTimeout(() => {
                document.getElementById('warning').style.display = 'none';
            }, 5000)
        }
        else {
            UserAPI.addUser(newUser, (err, res) => {
                if (err) {
                    if (err[0].extensions.exception.code === 11000) {
                        document.getElementById('warning').style.display = 'block';
                        document.getElementById('warning').innerHTML = "User already exists!";
                        setTimeout(() => {
                            document.getElementById('warning').style.display = 'none';
                        }, 5000)
                    }
                } else {
                    console.log(res);
                    toSignIn();
                }
            })
        }
    }

    const changeField = (e, field) => {
        let temp  = cloneDeep(newUser);
        if (field === "picture") {
            temp.profileLink = e.target.files[0];
        } else {
            temp[field] = e.target.value;
        }
        setNewUser(temp);
    }

    return (
        <div className="sign-in-page">
            <div className='sign-in-box'>
                <div className='header1'>
                    Sign Up
                </div>
                <form onSubmit={(e)=>signUp(e)}>
                {/* <div className='profilePic-box'>
                    <input
                        id="contained-button-file"
                        type="file"
                        accept="image/*"
                        style={{display:'none'}}
                        onChange={()=>{}}
                    />
                    <label htmlFor="contained-button-file">
                        <IconButton component='span' className='pic-container' style={{padding:0}}>
                        <Avatar 
                            src="" 
                            style={{
                                width: "70px",
                                height: "70px",
                            }}
                        />
                        <div className="edit-overlay">
                            <EditIcon className='edit-icon' />
                        </div>
                        </IconButton>
                    </label>
                </div> */}
                <TextField 
                    className='textfield'
                    size='small'
                    label='Username'
                    value={newUser.username}
                    onChange={(e)=>changeField(e, 'username')}
                    required
                />
                <TextField 
                    className='textfield'
                    size='small'
                    label='Email address'
                    value={newUser.email}
                    type='email'
                    onChange={(e)=>changeField(e, 'email')}
                    required
                />
                <TextField 
                    className='textfield'
                    size='small'
                    label='Password'
                    value={newUser.password}
                    type='password'
                    onChange={(e)=>changeField(e, 'password')}
                    required
                />
                <TextField 
                    className='textfield'
                    size='small'
                    label='Confirm Password'
                    value={confirmPassword}
                    type='password'
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    required
                />
                <div className='sign-up-message'>
                    <span>Already have an account? </span> 
                    <span className='sign-up-btn' onClick={()=>toSignIn()}>Sign in</span>
                </div>
                <div 
                    id='warning' 
                    style={{display:'none', color:'red'}}
                >
                </div>
                <Button type='submit' className='btn' variant='outlined' size='small'>sign up</Button>
                </form>
            </div>
        </div>
    )
}