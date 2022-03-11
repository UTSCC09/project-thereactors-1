import './App.scss';
import React from "react";
import { StyledEngineProvider } from '@mui/material';
import Router from './Router';
import Footer from './components/utils/Footer/Footer';

function App() {
  document.title = "RecipeCentral";
  return (
      <StyledEngineProvider injectFirst>
          <div className="App">
              <Router />
              <Footer />
          </div>
      </StyledEngineProvider>
  );
}

export default App;
