import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Splash from './components/Splash/Splash';
import AuthenticatedComponent from './components/AuthenticatedComponent'; // the component to show when the user is authenticated
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated } from './redux/gamesSlice';
import { Route, Routes } from 'react-router-dom';
import axios from "axios";
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
  const [time, setTime] = useState(0);

  function checkToken (twToken) {
    const intervalID = setInterval(myCallback, 1000, "Parameter 1");

    function myCallback() {
      // Your code here
      // Parameters are purely optional.

      axios({
        url: "https://id.twitch.tv/oauth2/validate",
        headers: {
          'Authorization': `OAuth ${twToken}`
        }
      }).then((response) => {
        console.log("validate: ", response)
        return response.json();
      }).catch(error => {
        console.error("validate error: ", error);
        return null;
      })
    }
      return intervalID;
  }


  useEffect(() => {
    // Get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth_token');
    const twitchToken = urlParams.get('twitch_token');

    setItem('authToken', authToken);
    setItem('twitchToken', twitchToken);

    if(authToken && twitchToken){
      const tokenData = checkToken(twitchToken);

      if (tokenData) {
        dispatch(setIsAuthenticated(true));        
      } else {
        setItem('authToken', null);  // Clear invalid tokens
        setItem('twitchToken', null);
        dispatch(setIsAuthenticated(false));
      }

      dispatch(setIsAuthenticated(true));

      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else {
      dispatch(setIsAuthenticated(false));
    }

    // else if (getItem('authToken') && getItem('twitchToken')) {
    //   dispatch(setIsAuthenticated(true));
    // } 



    // const validateTwitchToken = async (token) => {
    //   try {
    //     const response = await fetch(`https://id.twitch.tv/oauth2/validate`, {
    //       headers: {
    //         'Authorization': `OAuth ${token}`
    //       }
    //     });
    //     if (!response.ok) {
    //       throw new Error('Invalid token');
    //     }
    //     const data = await response.json();
    //     return data;  // Optionally handle more token validation data here
    //   } catch (error) {
    //     console.error('Twitch token validation failed:', error);
    //     return null;
    //   }
    // };
  
    // const checkAuthStatus = async () => {
    //   const authToken = getItem('authToken');
    //   const twitchToken = getItem('twitchToken');
  
    //   if (authToken && twitchToken) {
    //     const tokenData = await validateTwitchToken(twitchToken);
  
    //     if (tokenData) {
    //       dispatch(setIsAuthenticated(true));
    //     } else {
    //       setItem('authToken', null);  // Clear invalid tokens
    //       setItem('twitchToken', null);
    //       dispatch(setIsAuthenticated(false));
    //     }
    //   } else {
    //     dispatch(setIsAuthenticated(false));
    //   }
    // };
  
    // checkAuthStatus();
  }, []);

  // useEffect(() => {
  //   if (isAuthenticated === false) {
  //     setItem('authToken', null);  // Clear invalid tokens
  //     setItem('twitchToken', null);
  //   }
  // }, [isAuthenticated])

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