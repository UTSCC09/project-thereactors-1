import './DarkModeToggle.scss';
import React, { useEffect, useState } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function DarkModeToggle() {
    useEffect(() => {
        const checkbox = document.getElementById('checkbox');
        if (localStorage.getItem('theme') && localStorage.getItem('theme') === 'dark') {
            checkbox.checked = true;
        }
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                localStorage.setItem('theme', 'dark');
            }
            else {
                localStorage.setItem('theme', 'light');
            }
            let event = new Event('themeChange');
            document.dispatchEvent(event);
        })
    }, [])

    return (
        <div className='dark-theme-toggle'>
            <input type="checkbox" className="checkbox" id="checkbox"></input>
            <label htmlFor="checkbox" className="label">
                <DarkModeIcon className='dark-icon' />
                <LightModeIcon className='light-icon' />
                <div className='ball'></div>
            </label>
        </div>
    )
}