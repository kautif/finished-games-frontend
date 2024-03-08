import React from "react";
import axios from "axios";

export default function TwitchLoginBtn () {
        const handleLogin = async () => {
            const redirectUri = encodeURIComponent("http://localhost:4000/auth/twitch/callback");
            window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=x3gwkermcoxekyog2z220rnbme1c9b&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email`;
            try {
                
            } catch(error) {
                console.error(error);
            }
        }

    return (
        <button onClick={handleLogin}>Login with Twitch</button>
    )
}