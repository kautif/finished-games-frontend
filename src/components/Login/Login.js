import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header/Header";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
export default function Login () {
    const [error, setError] = useState("");
    const handleSuccess = async (credentialResponse) => {
        try {
            const accessToken = credentialResponse.credential.accessToken;
            const config = {
                method: "post",
                url: `https://localhost:4000/balls`,
                data: {
                    credential: credentialResponse
                },
                headers: {
                    "Content-Type": "application/json" 
                }
            }
            const response = await axios.post(config)
            console.log("to backend: ", response.data);
        } catch(error) {
            console.error("client side axios failure: ", error);
            // setError(error);
            // debugger;
        }
    }

    const [credential, setCredential] = useState({});
    return (
        <div>
            <Header />
            <p>{error}</p>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    setCredential(credentialResponse.credential);
                    handleSuccess(credentialResponse);
                }}
                onError={() => {
                    console.log("Login failed");
                }}
                clientId={process.env.REACT_APP_CLIENT_ID}
            />
        </div>
    )
}