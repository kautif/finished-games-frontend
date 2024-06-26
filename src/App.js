import { GoogleOAuthProvider } from '@react-oauth/google';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';
import './App.css';
import Login from './components/Login/Login';
import Splash from './components/Splash/Splash';
import TwitchLoginBtn from './components/TwitchLoginBtn/TwitchLoginBtn';
import AuthenticatedComponent from './components/AuthenticatedComponent'; // the component to show when the user is authenticated
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Search from './components/Search/Search';
import Gameslist from './components/Gameslist/Gameslist';
import Profile from './components/Profile/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams: ", urlParams);
    const token = urlParams.get('verified');
    console.log("App token: ", token);
    if(token || localStorage.getItem('auth_token')){
      localStorage.setItem('auth_token', 'true');
      setIsAuthenticated(true)
    }
  }, []);

  console.log("isAuthenticated: ", isAuthenticated);

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