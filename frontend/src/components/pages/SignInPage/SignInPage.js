import './SignInPage.scss';
import React, { useEffect, useState } from "react";
import { 
    Button,
    TextField 
} from "@mui/material";

export default function SignInPage() {

    const [mode, setMode] = useState('sign-in');
    
    useEffect(() => {

    }, []);

    const signIn = () => {

    }

    const signUp = () => {
        
    }

    return (
        <div className="sign-in-page">
            <div className='sign-in-box'>
                <div className='header1'>
                    {mode === 'sign-in' &&
                        <>Sign In</>
                    }
                    {mode === 'sign-up' &&
                        <>Sign Up</>
                    }
                </div>
                <TextField 
                    className='textfield'
                    size='small'
                    label='Username'
                    onChange={()=>{}}
                >
                </TextField>
                {mode === 'sign-up' &&
                    <TextField 
                        className='textfield'
                        size='small'
                        label='Email address'
                        type='email'
                        onChange={()=>{}}
                    >
                    </TextField>
                }
                <TextField 
                    className='textfield'
                    size='small'
                    label='Password'
                    type='password'
                    onChange={()=>{}}
                >
                </TextField>
                <div className='sign-up-message'>
                    {mode === 'sign-in' && 
                        <>
                        <span>Not registered yet? </span> 
                        <span className='sign-up-btn' onClick={()=>setMode('sign-up')}>Sign up</span>
                        </>
                    }
                    {mode === 'sign-up' && 
                        <>
                        <span>Already have an account? </span> 
                        <span className='sign-up-btn' onClick={()=>setMode('sign-in')}>Sign in</span>
                        </>
                    }
                </div>
                {mode === 'sign-in' && 
                    <Button className='btn' variant='outlined' size='small' onClick={signIn}>sign in</Button>
                }
                {mode === 'sign-up' && 
                    <Button className='btn' variant='outlined' size='small' onClick={signUp}>sign up</Button>
                }
            </div>
        </div>
    )
}