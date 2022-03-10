import './App.css';
import { StyledEngineProvider } from '@mui/material';
import Router from './Router';
import Navbar from './components/utils/Navbar/Navbar';
import Footer from './components/utils/Footer/Footer';

function App() {
  document.title = "RecipeCentral";
  return (
      <StyledEngineProvider injectFirst>
          <div className="App">
              <div>
                <Navbar />
                <Router />
              </div>
              <Footer />
          </div>
      </StyledEngineProvider>
  );
}

export default App;
