import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Splash from './components/Splash/Splash';
import AuthenticatedComponent from './components/AuthenticatedComponent'; // the component to show when the user is authenticated
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated } from './redux/gamesSlice';
import { Route, Routes } from 'react-router-dom';
import Search from './components/Search/Search';
import Gameslist from './components/Gameslist/Gameslist';
import Profile from './components/Profile/Profile';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.gamesReducer.isAuthenticated);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Get the token from the URL
    let urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams: ", urlParams);
    const token = urlParams.get('verified');
    console.log("App token: ", token);
    if(token || localStorage.getItem('auth_token')){
      localStorage.setItem('auth_token', 'true');
      dispatch(setIsAuthenticated(true));
    } else {
      dispatch(setIsAuthenticated(false));
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className="App">
          {isAuthenticated ? (
            <>
              <AuthenticatedComponent />
              <Routes>
                  <Route exact path="/search" element={<Search />} />
                  <Route exact path="/games" element={<Gameslist />} />
                  <Route exact path="/:user" element={<Profile />}></Route>
              </Routes>
            </>
            
          ) : (
            <>
              <Routes>
                <Route exact path="/" element={<Splash />}></Route>
                <Route exact path="/:user" element={<Profile />}></Route>
              </Routes>
            </>
          )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;