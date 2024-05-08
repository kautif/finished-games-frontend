import React from "react";

const TwitchLoginBtn = () => {
  const handleLogin = () => {
    const { REACT_APP_TWITCH_ID } = process.env;
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    const redirectUri = encodeURIComponent(`${backendURL}/auth/twitch/callback`);
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${REACT_APP_TWITCH_ID}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email`;
    window.location.href = authUrl;
  };

  return <button onClick={handleLogin}>Login with Twitch</button>;
};

export default TwitchLoginBtn;