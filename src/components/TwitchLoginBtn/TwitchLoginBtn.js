import React from "react";
import { setLoginTime } from "../../redux/gamesSlice";
import { useDispatch } from "react-redux";
import "./TwitchLoginBtn.css";
import TwitchLogo from "../../assets/twitch_logo.png";

// 6/23/24
// - in index.js (backend), in /auth/twitch/callback, no request body can be found which implies it is not being sent here. That may mean that it needs to be sent.
const TwitchLoginBtn = () => {
    const dispatch = useDispatch();
    const handleLogin = () => {
    const { REACT_APP_TWITCH_ID } = process.env;
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000/";
    console.log("backendURL: ", backendURL);
    const redirectUri = encodeURIComponent(`${backendURL}/auth/twitch/callback`);
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${REACT_APP_TWITCH_ID}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email`;
    window.location.href = authUrl;
  };

  return <button className="vh__login-btn" onClick={handleLogin}><img className="header__logo-img" src={TwitchLogo} alt="twitch logo"/><span className="vh__login-btn__text">Login</span></button>;
};

export default TwitchLoginBtn;