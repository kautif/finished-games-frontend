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
import { getItem, setItem } from './utils/localStorage';
import Donate from './components/Donate/Donate';
import Feedback from './components/Feedback/Feedback';
import Report from './components/Report/Report';
import FindUser from './components/FindUser/FindUser';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.gamesReducer.isAuthenticated);
  const [auToken, setAuToken] = useState("");
  const [twToken, setTwToken] = useState("");

  useEffect(() => {
    // Get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth_token');
    const twitchToken = urlParams.get('twitch_token');
    setAuToken(authToken);
    setTwToken(twitchToken);
    if(authToken && twitchToken){
      setItem('authToken', authToken);
      setItem('twitchToken', twitchToken);

      dispatch(setIsAuthenticated(true));

      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    else if (getItem('authToken') && getItem('twitchToken')) {
      dispatch(setIsAuthenticated(true));
    }
    else {
      dispatch(setIsAuthenticated(false));
    }
  }, []);

  useEffect(() => {
    if (auToken && twToken) {
      dispatch(setIsAuthenticated(true));
    } else {
      dispatch(setIsAuthenticated(false));
    }
  }, [auToken, twToken])

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className="App">
          {isAuthenticated ? (
            <>
              <AuthenticatedComponent />
              <Routes>
                  <Route exact path="/search" element={<Search />} />
                  <Route exact path="/games" element={<Gameslist />} />
                  <Route exact path="/finduser" element={<FindUser />}></Route>
                  <Route exact path="/:user" element={<Profile />}></Route>
                  <Route exact path="/donate" element={<Donate />}></Route>
                  <Route exact path="/feedback" element={<Feedback />}></Route>
                  <Route exact path="/report" element={<Report />}></Route>
              </Routes>
            </>
            
          ) : (
            <>
              <Routes>
                <Route exact path="/" element={<Splash />}></Route>
                <Route exact path="/:user" element={<Profile />}></Route>
                <Route exact path="/donate" element={<Donate />}></Route>
                <Route exact path="/feedback" element={<Feedback />}></Route>
              </Routes>
            </>
          )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;