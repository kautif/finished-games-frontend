import React from "react";
import axios from "axios";

export default function TwitchLoginBtn () {
        const handleLogin = async () => {
            const redirectUri = encodeURIComponent("http://localhost:4000/auth/twitch/callback");
            window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${REACT_APP_TWITCH_ID}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email`;

            try {
                // await axios.get(`https://id.twitch.tv/oauth2/authorize?client_id=x3gwkermcoxekyog2z220rnbme1c9b&redirect_uri=https://localhost:3000/auth/twitch/callback&response_type=code&scope=user:read:email`)
            } catch(error) {
                console.error(error);
            }
        }

    return (
        <button onClick={handleLogin}>Login with Twitch</button>
    )
}