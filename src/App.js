import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import Splash from "./components/Splash/Splash";
import AuthenticatedComponent from "./components/AuthenticatedComponent"; // the component to show when the user is authenticated
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated } from "./redux/gamesSlice";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Search from "./components/Search/Search";
import Gameslist from "./components/Gameslist/Gameslist";
import Profile from "./components/Profile/Profile";
import {
  getItem,
  getSessionitem,
  setAuthTokenExpiry,
  setItem,
  setSessionitem,
} from "./utils/localStorage";
import Donate from "./components/Donate/Donate";
import Feedback from "./components/Feedback/Feedback";
import Report from "./components/Report/Report";
import FindUser from "./components/FindUser/FindUser";
import axiosInstance from "./service/interceptor";
import { validateAuthToken } from "./service";
import { handleUnauthorizedRedirect } from "./utils";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.gamesReducer.isAuthenticated
  );
  const loginTime = useSelector((state) => state.gamesReducer.loginTime);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null); // Store interval ID

  function checkToken(twToken) {
    const intervalID = setInterval(myCallback, 1000, "Parameter 1");

    function myCallback() {
      // Your code here
      // Parameters are purely optional.
      setTime((prevTime) => prevTime + 1000);
      axios({
        url: "https://id.twitch.tv/oauth2/validate",
        headers: {
          Authorization: `OAuth ${twToken}`,
        },
      })
        .then((response) => {
          console.log("validate: ", response);
          return response.json();
        })
        .catch((error) => {
          console.error("validate error: ", error);
          return null;
        });
    }
    return intervalID;
  }

  const validateToken = async () => {
    try {
      const status = await validateAuthToken();
      if (status == 200) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
        setAuthTokenExpiry();
        checkTokenExpiry();
      }
    } catch (error) {
      console.log(error);
      dispatch(setIsAuthenticated(false));
    }
  };

  const checkTokenExpiry = () => {
    const tokenExpiry = getItem("authToken_expiry");

    if (tokenExpiry) {
      const expiryTime = new Date(tokenExpiry).getTime();
      const currentTime = Date.now();

      const timeLeft = expiryTime - currentTime;

      // Check if token has not expired yet
      if (timeLeft > 0) {
        // If interval is not set, start it
        if (!intervalRef.current) {
          // Set the interval to refresh the token exactly when it expires
          intervalRef.current = setTimeout(() => {
            if (document.visibilityState === "visible") {
              // Call validateToken only if the tab is active
              validateToken();
            }
          }, timeLeft);
        }
      } else if (isAuthenticated) {
        // If token has expired but user is still authenticated, retry after 10 seconds
        setTimeout(() => {
          checkTokenExpiry();
        }, 10000); // Retry after 10 seconds
      }
    }
  };

  useEffect(() => {
    // Get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get("auth_token");
    const refreshToken = urlParams.get("refresh_token");
    const twitchToken = urlParams.get("twitch_token");
    if (authToken && twitchToken && refreshToken) {
      setItem("authToken", authToken);
      setItem("twitchToken", twitchToken);
      setItem("refreshToken", refreshToken);
      setItem("reloadLogin", true);
      setSessionitem("reloadLogin", true);
      setAuthTokenExpiry();

      axios({
        url: "https://id.twitch.tv/oauth2/validate",
        headers: {
          Authorization: `OAuth ${twitchToken}`,
        },
      })
        .then((response) => {
          dispatch(setIsAuthenticated(true));
          console.log("validate: ", response);
          return response.json();
        })
        .catch((error) => {
          // When this is uncommented, it auto logs the user back out as soon as they login
          // - dispatch(setIsAuthenticated(false));
          console.error("validate error: ", error);
        });

      // const tokenData = checkToken(twitchToken);
      dispatch(setIsAuthenticated(true));
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      // if (tokenData) {
      // dispatch(setIsAuthenticated(true));
    } else if (
      getItem("authToken") &&
      getItem("twitchToken") &&
      getItem("refreshToken")
    ) {
      dispatch(setIsAuthenticated(true));
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (isAuthenticated) {
          checkTokenExpiry();
          if (!getItem("authToken")) {
            handleUnauthorizedRedirect();
          }
        }
        if (getItem("reloadLogin") && !getSessionitem("reloadLogin")) {
          window.location.reload(); // Reload the current page
          setSessionitem("reloadLogin", true);
        }
      }
    };

    // Adding event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      checkTokenExpiry();
    }
    // Cleanup function to clear the interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated]);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className="App">
        {isAuthenticated ? (
          <>
            <AuthenticatedComponent />
            <Routes>
              <Route exact path="/search" element={<Search />} />
              <Route exact path="/games" element={<Gameslist />} />
              <Route exact path ="/" element={<Navigate to="/games" />}/>
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
