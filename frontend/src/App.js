import './App.scss';
import React, { useEffect, useState } from "react";
import { StyledEngineProvider } from '@mui/material';
import Router from './Router';
import Footer from './components/utils/Footer/Footer';

function App() {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    if (localStorage.getItem('theme')) {
      setTheme(localStorage.getItem('theme'));
    }
    document.addEventListener('themeChange', () => {
      setTheme(localStorage.getItem('theme'));
    })
  }, []);

  document.title = "YT Watch Party";
  return (
      <StyledEngineProvider injectFirst>
          <div className={theme === 'dark' ? 'App-dark' : 'App'}>
              <Router />
              {/* <Footer /> */}
          </div>
      </StyledEngineProvider>
  );
}

export default App;
